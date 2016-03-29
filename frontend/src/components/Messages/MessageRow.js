import React from 'react';
import { Link, hashHistory } from 'react-router';

import config from '../../util/config.js';

import ScrollingMessage from './ScrollingMessage.js';
import TopicStore from '../../stores/TopicStore.js';

import './messages.scss';

var cheese = require('../../public/imgs/cheese.svg');
var cheese_hover = require('../../public/imgs/cheese_remove.svg');

/*
 * A row of streaming messages.
 * Handles the logic of when to draw the message after receiving it from the server.
 * Messages aren't drawn immediately to prevent overlapping messages.
 *
 * There are three message queues:
 * 1) this.messages
 * 2) this.state.messages
 *
 * (1) is the "true" message source. Messages arrive in this queue in batches
 * (2) contains messages that are currently being displayed
 */
const MessageRow = React.createClass({
  propTypes: {
    topicId: React.PropTypes.string.isRequired,
    color: React.PropTypes.string.isRequired,
    darkColor: React.PropTypes.string.isRequired,
    keyword: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      messages: [],
      hoverCheese: false,
      showMessageName: true
    }
  },

  componentWillMount: function() {
    this.removed = false;

    this.messages = [];
    this.messageStore = TopicStore.getMessageStore(this.props.topicId);
    this.keywordMessageStore = TopicStore.getKeywordMessageStore(this.props.topicId);

    this.keyword;
    if (typeof this.props.keyword !== 'undefined') {
      this.keyword = this.props.keyword;
      this.keywordMessageStore.getNewMessagesSignal(this.keyword).add(this.updateMessages, this);
    } else {
      this.keyword = null;
      this.keywordMessageStore.onNoBucketNewMessages.add(this.updateMessages, this);
    }

  },

  componentWillUnmount: function() {
    if (this.keyword !== null) {
      if (!this.removed) {
        this.keywordMessageStore.getNewMessagesSignal(this.keyword).remove(this.updateMessages, this);
      }
    } else {
      this.keywordMessageStore.onNoBucketNewMessages.remove(this.updateMessages, this);
    }

    if (this.displayTimeout) {
      clearTimeout(this.displayTimeout);
    }
  },

  /*
   * Update the state given new batch of messages
   */
  updateMessages: function(newMessages) {
    // Add new messages to the queue
    this.messages = this.messages.concat(newMessages);

    var timeDelta = config.SERVER_REQUEST_RATE / newMessages.length;
    this.displayMessages(newMessages.length, timeDelta);
  },

  /*
   * Add a single message to the row
   */
  displayMessages: function(numberOfMessages, timeDelta) {
    if (numberOfMessages === 0) return;

    // Take a message and add to state
    var newMessage = this.messages.shift();
    this.setState({ messages: this.state.messages.concat([newMessage]) });
    this.displayTimeout = setTimeout(this.displayMessages.bind(this, numberOfMessages - 1, timeDelta), timeDelta);
  },

  // For drawing the "X"
  mouseOverCheese: function() {
    this.setState({ hoverCheese: true });
  },

  // For drawing the "X"
  mouseOutCheese: function() {
    this.setState({ hoverCheese: false });
  },

  removeKeyword: function() {
    this.keywordMessageStore.getNewMessagesSignal(this.keyword).remove(this.updateMessages, this);
    this.keywordMessageStore.remove(this.props.keyword);
    this.removed = true;
  },
  
  toggleView: function() {
    if (this.state.showMessageName) {
      this.setState({ showMessageName: false });
    } else {
      this.setState({ showMessageName: true });
    }
  },

  /*
   * Remove the message from the row
   * This does not remove the message from the global message store
   */
  removeMessage: function(messageId) {
    var messages = this.state.messages;

    var i;
    for (i = 0; i < messages.length; i++) {
      if (messages[i].id === messageId) break;
    }

    messages.splice(i, 1);
    this.setState({ messages: messages });
  },

  render: function() {
    var topicId = this.props.topicId;

    var rowStyle = { backgroundColor: this.props.color };
    var keywordColor;
    if (this.props.darkColor) {
      keywordColor = { backgroundColor: this.props.darkColor };
    }

    var cheeseImg, keywordElem;
    var leftXLimit;
    // Keyword row
    if (this.keyword !== null) {
      var cheeseImage;
      if (this.state.hoverCheese) {
        cheeseImage = cheese_hover;
      } else {
        cheeseImage = cheese;
      }

      var keyWordText;
      if (this.state.showMessageName) {
        keyWordText = this.props.keyword;
      } else {
        keyWordText = "View Messages";
      }
 
      var allMessages = this.keywordMessageStore.getAllMessages(this.props.keyword);
      var numMessages = allMessages.length;
      var start = 0;
      var end = 0;
      var j = 0;
      var currSeconds = Math.floor((new Date).getTime() / 1000);
      var foundFirst = false;

      allMessages.forEach(function(message) {
          if (foundFirst){
            if (j == numMessages - 1) {
              end = message.time;
              return;
            }
          }
          else {
            if (message.time > currSeconds - config.MESSAGE_RATE_CALC_TIME) {
              start = message.time;
              foundFirst = true;
              numMessages = numMessages - j;
            }
          }
          j += 1;
      }, this);

      var rate = 0;
      if (start != 0 && start != end && end != 0) {
        rate = Math.floor( numMessages / (end - start) * 60);
      }
      var rateText;
      if (config.LANGUAGE.FRENCH) {
        rateText = rate + " messages par minute";
      }
      else {
        rateText = rate + " messages per minute";
      }

      if (config.LANGUAGE.FRENCH) {
      keywordElem = (
          <div className="keyword">
            <div className="keyword-bubble" style={keywordColor}>
              <div className="keyword-name">{this.props.keyword}</div>
              <div className="keyword-cancel" onClick={this.removeKeyword} >x</div>
            </div>
            <Link to={`/topics/${topicId}/messages/${this.props.keyword}`}>
              <div className="keyword-bubble" style={keywordColor}>
                <div className="keyword-name">Voir Les Messages</div>
              </div>
            </Link>
              <div className="keyword-bubble" style={keywordColor}>
                <div className="keyword-name">{rateText}</div>
              </div>
          </div>
        );
      }
      else {
        keywordElem = (
          <div className="keyword">
            <div className="keyword-bubble" style={keywordColor}>
              <div className="keyword-name">{this.props.keyword}</div>
              <div className="keyword-cancel" onClick={this.removeKeyword} >x</div>
            </div>
            <Link to={`/topics/${topicId}/messages/${this.props.keyword}`}>
              <div className="keyword-bubble" style={keywordColor}>
                <div className="keyword-name">View Messages</div>
              </div>
            </Link>
              <div className="keyword-bubble" style={keywordColor}>
                <div className="keyword-name">{rateText}</div>
              </div>
          </div>
        );
      }
      leftXLimit = window.innerWidth - config.CHEESE_LEFT_OFFSET;
    }
    // Top row
    else {
      leftXLimit = window.innerWidth + config.MESSAGE_WIDTH;
    }

    return (
        <div className="messageRow" style={rowStyle}>
        {keywordElem}
          {
            this.state.messages.map( (message) => {
              return <ScrollingMessage
                key={message.id}
                id={message.id}
                message={message.content}
                leftXLimit={leftXLimit}
                removeCallback={this.removeMessage} />
            })
          }
        </div>
    );
  }
});

export default MessageRow;
