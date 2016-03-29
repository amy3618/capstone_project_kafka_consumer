import React from 'react';

import config from '../../util/config.js';

import Header from '../Header/Header.js';
import TopicStore from '../../stores/TopicStore.js';
import MessageList from './MessageList.js';
import './messages.scss';

const KeywordMessageList = React.createClass({
  getInitialState: function() {
    this.messageStore = TopicStore.getMessageStore(this.props.params.topicId);
    this.messageStore.onUpdate.add(this.updateMessages, this);
    var messages = this.filterMessages(this.messageStore.getAll());

    return { messages: messages };
  },

  componentWillUnmount: function() {
    this.messageStore.onUpdate.remove(this.updateMessages, this);
  },

  updateMessages: function(newMessages) {
    var messages = this.state.messages.concat(this.filterMessages(newMessages));
    this.setState({ messages: messages });
  },

  filterMessages: function(messages) {
    var keyword = this.props.params.keyword;
	var regexKeyword = new RegExp(keyword);
    if (keyword) {
      return messages.filter(function(message) {
        return regexKeyword.test(message.content);
      });
    } else {
      return messages;
    }
  },

  render: function() {
    return (
        <div>
          <Header
            title={this.props.params.keyword}
            previousPageText={this.props.params.topicId}
            previousPageLink={`/topics/${this.props.params.topicId}`}
          />

          <MessageList messages={this.state.messages} />
        </div>
        );
  }
});

module.exports = KeywordMessageList;
