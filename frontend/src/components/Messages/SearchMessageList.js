import React from 'react';

import config from '../../util/config.js';

import Header from '../Header/Header.js';
import TopicStore from '../../stores/TopicStore.js';
import MessageList from './MessageList.js';
import './messages.scss';

const SearchMessageList = React.createClass({
  getInitialState: function() {
    this.messageStore = TopicStore.getMessageStore(this.props.params.topicId);
    this.messageStore.onUpdate.add(this.updateMessages, this);

    this.allMessages = this.messageStore.getAll();
    var messages = this.filterMessages(this.allMessages, this.props.params.searchTerm);

    return {
      messages: messages,
      searchTerm: this.props.params.searchTerm
    };
  },

  componentWillUnmount: function() {
    this.messageStore.onUpdate.remove(this.updateMessages, this);
  },

  updateMessages: function(newMessages) {
    // Add new messages to all
    this.allMessages = this.allMessages.concat(newMessages);

    // Show relevant messages
    var newMessages = this.filterMessages(newMessages, this.state.searchTerm);
    var messages = this.state.messages.concat(newMessages);

    this.setState({ messages: messages });
  },

  filterMessages: function(messages, searchTerm) {
    if (searchTerm) {
      return messages.filter(function(message) {
        return message.content.indexOf(searchTerm) > -1;
      });
    } else {
      return messages;
    }
  },

  search: function(searchTerm) {
    var messages = this.filterMessages(this.allMessages, searchTerm);

    this.setState({
      searchTerm: searchTerm,
      messages: messages
    });
  },

  render: function() {
    return (
        <div>
          <Header
            title="Search"
            previousPageText={this.props.params.topicId}
            previousPageLink={`/topics/${this.props.params.topicId}`}
            initialSearchTerm={this.props.params.searchTerm}
            searchPlaceholder="Search All Messages"
            onSearchSubmit={this.search}
            onSearchTermChange={this.search}
          />

          <MessageList messages={this.state.messages} />
        </div>
        );
  }
});

module.exports = SearchMessageList;
