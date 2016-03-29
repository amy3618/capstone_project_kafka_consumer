import React from 'react';

import $ from 'jquery';
import config from '../../util/config.js';

import TopicStore from '../../stores/TopicStore.js';
import Message from './Message.js';
import './messages.scss';

const MessageList = React.createClass({
  propTypes: {
    messages: React.PropTypes.array.isRequired
  },

  componentWillUpdate: function() {
    var node = this.getDOMNode();
    this.scrollHeight = node.scrollHeight;
    this.scrollTop = $(document).scrollTop();
  },

  componentDidUpdate: function() {
    if (this.scrollTop > $("#header").outerHeight()) {
      var node = this.getDOMNode();
      var newScrollTop = this.scrollTop + (node.scrollHeight - this.scrollHeight);
      $(document).scrollTop(newScrollTop);
    }
  },

  render: function() {
    if (! config.CHRONOLOGICAL_ORDER) {
      var reversedMessages = [].concat(this.props.messages).reverse();

      return (
          <div className="messages">
            {
              reversedMessages.map((message) => {
                return <Message
                  key={message.id}
                  id={message.id}
                  message={message.content}
                  />
              })
            }
          </div>
      );
    }
    else
    {
      return (
          <div className="messages">
            {
              this.props.messages.map((message) => {
                return <Message
                  key={message.id}
                  id={message.id}
                  message={message.content}
                  />
              })
            }
          </div>
      );
    }
  }
});

module.exports = MessageList;
