import KeywordMessageStore from './KeywordMessageStore.js';
import MessageStore from './MessageStore.js';

var _topics = {};

var TopicStore = {
  getKeywordMessageStore: function(topicId) {
    var topic = this.getTopic(topicId);
    var messageStore = this.getMessageStore(topicId);

    return topic.keywordMessageStore || (topic.keywordMessageStore = new KeywordMessageStore(messageStore));
  },

  getMessageStore: function(topicId) {
    var topic = this.getTopic(topicId);
    return topic.messageStore || (topic.messageStore = new MessageStore(topicId));
  },

  getTopic: function(topicId) {
    _topics[topicId] = _topics[topicId] || {};

    return _topics[topicId];
  }
};

module.exports = TopicStore;
