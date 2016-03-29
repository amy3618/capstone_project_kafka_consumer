import React from 'react';

import SetIntervalMixin from '../../util/SetIntervalMixin.js';
import config from '../../util/config.js';

import './messages.scss';

var mouse_1 = require('../../public/imgs/mouse_1.svg');
var mouse_2 = require('../../public/imgs/mouse_2.svg');

/*
 * Message that moves from the right side of the screen to the left side of the screen
 */
const ScrollingMessage = React.createClass({
  propTypes: {
    id: React.PropTypes.number.isRequired,
    message: React.PropTypes.string.isRequired,
    leftXLimit: React.PropTypes.number.isRequired,
    removeCallback: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      x: 0
    }
  },

  componentDidMount: function() {
    this.move();
  },

  componentWillUnmount: function() {
    cancelAnimationFrame(this.animationFrameId);
  },

  move: function() {
    this.animationFrameId = requestAnimationFrame(this.move);
    var newX = this.state.x + config.MOUSE_RUN_SPEED;

    if (newX > this.props.leftXLimit) {
      this.props.removeCallback(this.props.id);
    } else {
      this.setState({
        x: newX
      });
    }
  },

  render: function() {
    var style = {
      transform: "translate(" + -this.state.x + "px, -50%)"
    };
	if (this.state.x % 120 >= 60)
	{		return (
			<div className="scrolling-message" style={style}>
			  <div className="scrolling-message-bubble">
				<div className="scrolling-bubble">
				  { this.props.message }
				</div>
				<div className="bubble-triangle-vertical"></div>
			  </div>

			  <img className="mouse" src={mouse_1}/>
			</div>
		);
	}
	else
	{
		return (
			<div className="scrolling-message" style={style}>
			  <div className="scrolling-message-bubble">
				<div className="scrolling-bubble">
				  { this.props.message }
				</div>
				<div className="bubble-triangle-vertical"></div>
			  </div>

			  <img className="mouse" src={mouse_2}/>
			</div>
		);
	}
  }
});

export default ScrollingMessage;
