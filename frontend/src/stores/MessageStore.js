import config from '../util/config.js';
import Signal from '../util/Signal.js';

class MessageStore {
  constructor(topicId) {
    this.topicId = topicId;

    this.serverEndpoint = config.SERVER_URL + "/messages";

    // Server defaults
    this.lastMsgId = -1;
    this._getLatestMessageId();

    // Messages
    this._messages = [];

    // Signal
    // Called when new messages arrive
    // @param [new messages]
    this.onUpdate = new Signal();
  }

  getAll() {
    return this._messages;
  }

  /*
   * Get the latest message id and start polling
   */
  _getLatestMessageId() {
    var endpoint = config.SERVER_URL + "/latestMessageId/" + this.topicId;
    var request = new XMLHttpRequest();
    request.open('GET', endpoint);

    request.onload = (function() {
      var response = JSON.parse(request.responseText);
      this.lastMsgId = -1;

      // Start polling
      this._fetchMessages();
    }).bind(this);

    request.send();
  }

  /*
   * Fetch new messages from server
   */
  _fetchMessages() {
    var request = new XMLHttpRequest();
    request.open('POST', this.serverEndpoint);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    var params = {
      topic: this.topicId,
      lastMsgId: this.lastMsgId,
      numMsgs: config.SERVER_REQUEST_NUM_MESSAGES
    };

    request.onload = (function() {
      var response = JSON.parse(request.responseText);

      // Convert
      var newMessages = this._createMessages(response.messages);

      // Broadcast
      this.onUpdate.dispatch(newMessages);

      // Save
      this._mergeMessages(newMessages);
      this.lastMsgId = response.lastSentMsgId;
    }).bind(this);

    request.send(JSON.stringify(params));

    /*
    // TODO Remove, used for debugging
    // TODO When debugging, create a variable 'i' at the top of this file
    setTimeout((function() {
      var messages = [];
      messages.push("m" + (i++));

      var response = { messages };

      console.log("asdfasd")
      // Convert
      var newMessages = this._createMessages(response.messages);

      // Broadcast
      this.onUpdate.dispatch(newMessages);

      // Save
      this._mergeMessages(newMessages);
    }).bind(this), 0);
    */

    // Fetch again later
    setTimeout(this._fetchMessages.bind(this), config.SERVER_REQUEST_RATE);
  }

  /*
   * Convert server message to internal representation
   */
  _createMessages(messages) {
    return messages.map(function(message) {
      var id = this.lastMsgId++;
      var seconds = Math.floor((new Date).getTime() / 1000);
      return { content: message + " " + id, id: id, time: seconds };
    }, this);
  }

  /*
   * Merge new list of messages with current messages
   */
  _mergeMessages(newMessages) {
    this._messages = this._messages.concat(newMessages);

    // Cull list
    if (this._messages.length > config.MESSAGE_STORE_MAX_MESSAGES) {
      var numberOfMessagesToRemove = this._messages.length - config.MESSAGE_STORE_MAX_MESSAGES;
      this._messages.splice(0, numberOfMessagesToRemove);
    }
  }
}

module.exports = MessageStore;
