import React from 'react';

import { Link, hashHistory } from 'react-router';

import config from '../../util/config.js';

import './topics.scss';

var owlSVG, fontColour;
var owlAvocado = require('../../public/imgs/owl-avocado.svg');
var owlBlack = require('../../public/imgs/owl-black.svg');
var owlBlue = require('../../public/imgs/owl-blue.svg');
var owlGreen = require('../../public/imgs/owl-green.svg');
var owlOrange = require('../../public/imgs/owl-orange.svg');
var owlPink = require('../../public/imgs/owl-pink.svg');
var owlPurple = require('../../public/imgs/owl-purple.svg');
var owlRed = require('../../public/imgs/owl-red.svg');
var owlTeal = require('../../public/imgs/owl-teal.svg');

var colorIndex = 0;


const Topic = React.createClass({
  render: function() {
    
    switch( colorIndex % 9 ){
      
      case 0: 
        owlSVG = owlAvocado;
        fontColour = {color: "#93aa65"};
      break;
        
      case 1: 
        owlSVG = owlBlack;
        fontColour = {color: "#000000"};
      break;
        
      case 2: 
        owlSVG = owlBlue;
        fontColour = {color: "#006c9f"};
      break;
    
      case 3: 
        owlSVG = owlGreen;
        fontColour = {color: "#668408"};
      break;
        
      case 4: 
        owlSVG = owlOrange;
        fontColour = {color: "#c25c00"};
      break;
      
      case 5: 
        owlSVG = owlPink;
        fontColour = {color: "#d05de8"};
      break;
        
      case 6: 
        owlSVG = owlPurple;
        fontColour = {color: "#6a43b5"};
      break;
        
      case 7: 
        owlSVG = owlRed;
        fontColour = {color: "#dd4048"};
      break;
        
      case 8: 
        owlSVG = owlTeal;
        fontColour = {color: "#3cbfac"};
      break;

    }
    
    colorIndex++;
    
    return (
      <Link to={`/topics/${this.props.topicName}`}>
        <div className="topic">
          <img className="owl" src={owlSVG} />
          <span className="topic-name" style={fontColour} >
                { this.props.topicName }
          </span>
        </div>
      </Link>
    );
  }
});

module.exports = Topic;
