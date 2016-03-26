package models

import kafka.api.{Request, OffsetRequest, PartitionOffsetRequestInfo, FetchRequestBuilder}
import kafka.common.TopicAndPartition
import kafka.consumer.{SimpleConsumer}
import kafka.utils.ZKStringSerializer
import org.I0Itec.zkclient.ZkClient
import kafka.utils._
import org.I0Itec.zkclient.serialize.ZkSerializer
import play.api.Logger
import scala.collection.mutable.ListBuffer
import scala.collection.mutable.Map
import java.lang.Runnable

/**
 * Created by amy on 12/11/2015.
 *
}
 */
class ConsumerServer (host: String, sessTimeout: Int = 10000, connTimeout: Int = 10000, serializer: ZkSerializer = ZKStringSerializer,
                 groupId: Int = 1234, kafkaHost: String, port: Int, timeOut: Int = 3000, bufferSize: Int = 100, clientId: String = "typesafe",
                 partition: Int = 0, offset: Long = 0L, fetchSize: Int = 1000000) {

    val zookeeperClient = new ZkClient(host, sessTimeout, connTimeout, serializer)
    var topicConsumerMap = Map[String,TopicConsumer]()

    def getZhost : String = { return host }
    def getKhost: String = { return kafkaHost }
    def getKport: Int = { return port }

    // get list of all topics on this zookeeper connection
    def getAllTopics() : List[String] = {
      val allTopics = ZkUtils.getAllTopics(zookeeperClient).sorted
      var topicsList = ListBuffer[String]()
      for (topic <- allTopics) {
        topicsList += topic
        getTopicConsumer(topic)
      }
      return topicsList.toList
    }

    // create Consumer for particular topic
    class TopicConsumer(topic: String, maxMessages: Int = 1000) {
      val simpleConsumer = new SimpleConsumer(kafkaHost, port, timeOut, bufferSize, clientId)
      topicConsumerMap(topic) = this
      var startingOffset = -1L              // initialize to latest offset
      var nextOffset = offset               // initialize to start at zero
      var curID = 0L                        // initialize first message id

      var messagesQueue = List[KMessage]()
      new Thread(new MessagesThread()).start()                // create thread to periodically update messages for this topic

      // get new messages for this topic
      def updateMessagesForTopic() {
        val fetchRequest = new FetchRequestBuilder().clientId(clientId)
        fetchRequest.addFetch(topic, partition, nextOffset, fetchSize)
        val fetchResponse = simpleConsumer.fetch(fetchRequest.build())

        // get the offset to start reading from next time
        try {
          nextOffset = simpleConsumer.earliestOrLatestOffset(TopicAndPartition(topic, partition), startingOffset, Request.DebuggingConsumerId)
        } catch {
          case t: Throwable =>
            System.err.println("Error in getting earliest or latest offset due to: " + Utils.stackTrace(t))
        }

        // fetch the messages for this topic
        val result = fetchResponse.data.values.flatMap { topic =>
          topic.messages.toList.map { mao =>
            val payload =  mao.message.payload
            val data = Array.fill[Byte](payload.limit)(0)
            payload.get(data)
            new String(data)
          }
        }

        val resultList = result.toList
        var newMessagesBuffer = ListBuffer[KMessage]()
        val currentTime = System.currentTimeMillis()
        for (i <- 0 until resultList.size) {
            newMessagesBuffer += new KMessage(curID, resultList(i))
            curID += 1
        }

        // if there are any new messages, update messagesQueue with most recent messages
        val numNewMessages = resultList.size
        if (numNewMessages > 0) {
		  Logger.info("fetched: " + numNewMessages.toString())
          if (numNewMessages > maxMessages) {
            messagesQueue.synchronized {
              messagesQueue = newMessagesBuffer.toList.drop(numNewMessages - maxMessages)
            }
          }
          else if (numNewMessages == maxMessages) {
            messagesQueue.synchronized {
              messagesQueue = newMessagesBuffer.toList
            }
          }
          else {
            messagesQueue.synchronized {
              if (messagesQueue.size <= (maxMessages - numNewMessages)) {
                messagesQueue = List.concat(messagesQueue, newMessagesBuffer.toList)
              }
              else {
                messagesQueue = List.concat(messagesQueue.drop(numNewMessages), newMessagesBuffer.toList)
              }
            }
          }
        }
      }

      // returns result by querying messagesQueue
      def getNewMessages(lastMsgId: Long, numNew: Int): List[KMessage] = {
        var start = -1
        var newMessages = List[KMessage]()
        messagesQueue.synchronized {
          start = getStartingIndex(messagesQueue,lastMsgId)
          if (start < messagesQueue.size)
            newMessages = messagesQueue.slice(start, Math.min(start+numNew+1,messagesQueue.size))
        }
        return newMessages
      }

      def getStartingIndex(messagesQueue: List[KMessage], lastMsgId: Long): Int = {
        var i = 0
        val newMessagesBuffer = messagesQueue.toBuffer
        while (i < newMessagesBuffer.size && newMessagesBuffer(i).getID <= lastMsgId) {
          i += 1
        }
        return i
      }

      class MessagesThread() extends Runnable {
        def run() {
          while (true) {
            updateMessagesForTopic()
            Thread sleep (1000)
          }
        }
      }

      def getLatestID(): Long = {
        return curID
      }
    }

    // get the consumer responsible for this topic
    def getTopicConsumer(topic: String): TopicConsumer = {
      if (topicConsumerMap.contains(topic)) {
        return topicConsumerMap.apply(topic)
      }
      // consumer not created yet, create it
      new TopicConsumer(topic)
      return topicConsumerMap.apply(topic)
    }
}
