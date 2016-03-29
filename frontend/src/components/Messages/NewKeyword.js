import React from 'react';

import config from '../../util/config.js';

import './messages.scss';

var cheese = require('../../public/imgs/cheese.svg');

const NewKeyword = React.createClass({
  propTypes: {
    keywordStore: React.PropTypes.object.isRequired
  },

  createNewKeyword: function(ev) {
    ev.preventDefault();

    var keyword = document.getElementById("new-keyword").value;
    document.getElementById("new-keyword").value = "";

    this.props.keywordStore.add(keyword);
  },

  render: function() {
    if (config.LANGUAGE.FRENCH) {
      return (
          <div className="messageRow newKeywordRow">
            <img className="cheese" src={cheese} />
            <form onSubmit={this.createNewKeyword} autoComplete="off">
              <input id="new-keyword" className="new-keyword" type="text" name="keyword" placeholder="Nouveau Mot-Clé" />
        </form>
          </div>
      );
    }
    else {
      return (
          <div className="messageRow newKeywordRow">
            <img className="cheese" src={cheese} />
            <form onSubmit={this.createNewKeyword} autoComplete="off">
              <input id="new-keyword" className="new-keyword" type="text" name="keyword" placeholder="New Keyword" />
        </form>
          </div>
      );
    }
  }
});

export default NewKeyword;
