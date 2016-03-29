import React from 'react';

import config from '../../util/config.js';

import './messages.scss';

var mouse_1 = require('../../public/imgs/mouse_1.svg');

const Message = React.createClass({
  render: function() {
    return (
      <div className="message">
        <img className="static-mouse" src={mouse_1} />
        <div className="message-bubble">
          <div className="bubble-triangle-left"></div>
          <div className="bubble">
              { this.props.message }
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Message;
