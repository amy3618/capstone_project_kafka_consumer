import config from '../util/config.js';
import Signal from '../util/Signal.js';

import KeywordStore from './KeywordStore.js';
import MessageStore from './MessageStore.js';
import TopicStore from './TopicStore.js';

/*
 * Stores a copy of messages sorted by keyword
 *
 * There is a special bucket (keyword='') that contains
 * messages that do not go into the other buckets
 *
 * NOTE: This special bucket isn't persisted. It can only be accessed through newMessages dispatches
 */
class KeywordMessageStore extends KeywordStore {
  constructor(messageStore) {
    super();

    this._messages = {};

    // Map of Signals
    // @param [newMessages]
    this._newMessagesSignals = {};

    this.messageStore = messageStore;
    this.messageStore.onUpdate.add(this._sortMessages, this);

    // Signal
    // @param [newMessages] - messages that do not fall into any keywords
    this.onNoBucketNewMessages = new Signal();
  }

  /*
   * Add a keyword
   * Creates a new message bucket for this keyword
   *
   * @return newMessagesSignal
   */
  add(keyword) {
    super.add(keyword);

    this._messages[keyword] = [];
    this._newMessagesSignals[keyword] = new Signal();

    // Sort all existing messages
    var allMessages = this.messageStore.getAll();
    this._sortMessages(allMessages, keyword, false);

    return this._newMessagesSignals[keyword];
  }

  /*
   * Remove the keyword
   * Deletes the message bucket for this keyword
   */
  remove(keyword) {
    super.remove(keyword);

    delete this._messages[keyword];
    delete this._newMessagesSignals[keyword];
  }

  /*
   * Get the new messages signal associated with this signal
   * The signal dispatches everytime there are new messages containing
   * the given keyword.
   *
   * The dispatch argument contains new messages only
   */
  getNewMessagesSignal(keyword) {
    if (keyword in this._newMessagesSignals) {
      return this._newMessagesSignals[keyword];
    }
  }

  /*
   * Get all messages with given keyword
   */
  getAllMessages(keyword) {
    if (keyword in this._messages) {
      return this._messages[keyword];
    }
  }

  /*
   * Sort messages into keyword buckets
   * @param messages ([string])
   * @param keywords (optional [string]) - defaults to all keywords
   * @param isUpdate (optional bool) - defaults to false - only broadcast homeless messages on updates
   */
  _sortMessages(messages, keywords, isUpdate) {
    if (typeof keywords === 'undefined') {
      keywords = this._keywords;
    } else if (!Array.isArray(keywords)) {
      keywords = [keywords];
    }

    if (typeof isUpdate === 'undefined') {
      isUpdate = true;
    }

    var noBucketMessages = messages.slice();

    var k = 0;
    keywords.forEach(function(keyword) {
      var newMessages = [];
	  var regexKeyword = new RegExp(keyword);
      messages.forEach(function(message) {
        var content = message.content;
		// content.indexOf(keyword) < -1
        if (regexKeyword.test(content)) {
          newMessages.push(message);
          var i;
          if ((i = noBucketMessages.indexOf(message)) > -1) {
            noBucketMessages.splice(i, 1);
          }
        }
      }, this);

      this._messages[keyword] = this._messages[keyword].concat(newMessages);
      this._newMessagesSignals[keyword].dispatch(newMessages);
      k = k + 1;
    }, this);

    // Special bucket
    if (isUpdate) {
      this.onNoBucketNewMessages.dispatch(noBucketMessages);
    }
  }
}

module.exports = KeywordMessageStore;
