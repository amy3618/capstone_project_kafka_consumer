package controllers

import models._
import play.api.Logger
import play.api.mvc._
import play.api.libs.json._
import scala.collection.mutable.ListBuffer
import scala.collection.mutable.Map
import scala.io.Source

class Application extends Controller {
  var c = setupConnection
  if (setupConnection == null) {
    System.exit(-1)
  }

  def setupConnection: ConsumerServer = {
    var lines = Source.fromFile("conf/server.info").getLines()
    if (!lines.hasNext) {
      Logger.info("wrong server.info format")
      System.exit(-1)
    }
    var zhost = lines.next()
    if (!lines.hasNext) {
      Logger.info("wrong server.info format")
      System.exit(-1)
    }
    var khost = lines.next()
    if (!lines.hasNext) {
      Logger.info("wrong server.info format")
      System.exit(-1)
    }
    var kport = lines.next().toInt

    // create new consumerServer for this zhost
    try {
      val c = new ConsumerServer(host = zhost, kafkaHost = khost, port = kport)
      Logger.info("started ConsumerServer")
      return c
    }
    catch {
      case e: Exception => {
        Logger.info("error starting ConsumerServer")
        return null
      }
    }
  }

  def preflight(all: String) = Action {
    Ok("").withHeaders("Access-Control-Allow-Origin" -> "*",
      "Allow" -> "*",
      "Access-Control-Allow-Methods" -> "POST, GET, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers" -> "Origin, X-Requested-With, Content-Type, Accept, Referrer, User-Agent")
  }

  def topics = Action { request =>
    val allTopics = c.getAllTopics()
    Ok(Json.toJson(allTopics)).withHeaders("Access-Control-Allow-Origin" -> "*",
      "Allow" -> "*",
      "Access-Control-Allow-Methods" -> "POST, GET, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers" -> "Origin, X-Requested-With, Content-Type, Accept, Referrer, User-Agent")
  }

  def messages = Action { request =>
    val json: JsValue = request.body.asJson.get
    val topic = (json \ "topic").as[String]
    val lastMsgId = (json \ "lastMsgId").as[Long]
	Logger.info("lastMsgId = " + lastMsgId.toString())
    val numMsgs = (json \ "numMsgs").as[Int]
    val newMessages = c.getTopicConsumer(topic).getNewMessages(lastMsgId,numMsgs)
    val messagesContents: JsValue = Json.toJson(getContents(newMessages))
    var lastSentMsgId = lastMsgId
    if (newMessages.size > 0)
      lastSentMsgId = newMessages(newMessages.size-1).getID

    val jsonResponse: JsValue = JsObject(Seq(
      "messages" -> messagesContents,
      "lastSentMsgId" -> JsNumber(lastSentMsgId)
    ))
	Logger.info("lastSentMsgId = " + lastSentMsgId.toString())

    Ok(Json.toJson(
      jsonResponse
    )).withHeaders("Access-Control-Allow-Origin" -> "*",
        "Allow" -> "*",
        "Access-Control-Allow-Methods" -> "POST, GET, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers" -> "Origin, X-Requested-With, Content-Type, Accept, Referrer, User-Agent")
  }

  def firstMessagesRequest(topic: String) = Action { request =>
    val latestID = c.getTopicConsumer(topic).getLatestID()
	Logger.info("latestID= " + latestID.toString())

    Ok(Json.toJson(
      latestID
    )).withHeaders("Access-Control-Allow-Origin" -> "*",
        "Allow" -> "*",
        "Access-Control-Allow-Methods" -> "POST, GET, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers" -> "Origin, X-Requested-With, Content-Type, Accept, Referrer, User-Agent")
  }

  // creates list of message contents without <id> for each
  def getContents(messages: List[KMessage]): Array[String] = {
    var contents = ListBuffer[String]()
    var m = new KMessage(0L, null)
    for (m <- messages) {
        contents += m.getContent
    }
    val contentsArray = new Array[String](contents.size)
    contents.toList copyToArray(contentsArray)
    return contentsArray
  }



}
