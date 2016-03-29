import React from 'react';
import { hashHistory } from 'react-router';

import config from '../../util/config.js';

import SetIntervalMixin from '../../util/SetIntervalMixin.js';
import Header from '../Header/Header.js';
import MessageRow from './MessageRow.js';
import NewKeyword from './NewKeyword.js';
import MessageStore from '../../stores/MessageStore.js';
import TopicStore from '../../stores/TopicStore.js';

import './messages.scss';

var _colors = ["#f1fbd0", "#dffdf1", "#f6dbdb"];
var _darkColors = ["#86c400", "#6a9ab7", "#e36161"];
var isTimer = false;
/*
 * The main messages screen.
 * Messages stream across the window on multiple rows.
 *
 * Each row has a keyword. Messages that contain that keyword show up in the row.
 * A message that doesn't match any of the keywords show up at the top row.
 */
const Messages = React.createClass({
  mixins: [SetIntervalMixin],
  // TODO request color scheme
  propTypes: {
  },

  getInitialState: function() {
    return {
      tickCount: false,
    }
  },
  
  getInitialState: function() {
    this.keywordStore = TopicStore.getKeywordMessageStore(this.props.params.topicId);
    this.keywordStore.onUpdate.add(this.updateKeywords, this);

    var keywords = this.buildKeywords(this.keywordStore.getAll());
    return { keywords: keywords };
  },

  /*
   * Global list of keywords changed, update rows
   */
  updateKeywords: function(keywords) {
    this.setState({ keywords: this.buildKeywords(keywords) });
    if (false == isTimer) {
      isTimer = true;
      this.setInterval(this.tick,config.MESSAGE_UPDATE_RATE);
    }
  },

  tick: function() { /* updates the incoming message rate every N seconds */
    if (this.state.tickCount) this.setState({ tickCount: true });
    else this.setState({ tickCount: false });
    var timer = this.setInterval(this.tick,config.MESSAGE_UPDATE_RATE);
  },
  
  /*
   * Add top row (which doesn't have a keyword) to keywords
   */
  buildKeywords: function(keywords) {
    keywords = keywords.slice();

    // Add base to front
    keywords.unshift(null);
    return keywords;
  },

  componentWillUnmount: function() {
    this.keywordStore.onUpdate.remove(this.updateKeywords, this);
  },

  search: function(searchTerm) {
    hashHistory.push('/topics/' + this.props.params.topicId + '/search/' + searchTerm);
  },

  render: function() {
    if (config.LANGUAGE.FRENCH) {
      return (
          <div>
            <Header
              title={this.props.params.topicId}
              previousPageText="Les Sujets"
              previousPageLink="/topics"
              searchPlaceholder="Rechercher Tous Les Messages"
              onSearchSubmit={this.search}
            />

            {
              this.state.keywords.map( (keyword, i) => {
                var color = _colors[i % _colors.length];
                var darkColor = _darkColors[i % _darkColors.length];

                var properties = {
                  topicId: this.props.params.topicId,
                  color: color,
                  darkColor: darkColor
                }

                if (keyword !== null) {
                  properties.key = keyword;
                  properties.keyword = keyword;
                } else {
                  properties.key = '';
                }

                return <MessageRow {...properties} />
              })
            }
            <NewKeyword keywordStore={this.keywordStore} />
          </div>
      );
    }
    else {
      return (
          <div>
            <Header
              title={this.props.params.topicId}
              previousPageText="Topics"
              previousPageLink="/topics"
              searchPlaceholder="Search All Messages"
              onSearchSubmit={this.search}
            />

            {
              this.state.keywords.map( (keyword, i) => {
                var color = _colors[i % _colors.length];
                var darkColor = _darkColors[i % _darkColors.length];

                var properties = {
                  topicId: this.props.params.topicId,
                  color: color,
                  darkColor: darkColor
                }

                if (keyword !== null) {
                  properties.key = keyword;
                  properties.keyword = keyword;
                } else {
                  properties.key = '';
                }

                return <MessageRow {...properties} />
              })
            }
            <NewKeyword keywordStore={this.keywordStore} />
          </div>
      );
    }
}
});

export default Messages;
