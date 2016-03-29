import React from 'react';

import config from '../../util/config.js';

import Branch from './Branch.js';

import './topics.scss';

//TODO: better scaling and aesthetics, better fit everything to various screen sizes, not just my own
var trunkSVG = require('../../public/imgs/tree-trunk.svg');

const Trunk = React.createClass({
  render: function() {
    
    //Divides topics up into groups of 3 to be dispatched to each branch
    var topicList = [];
        for(var i = 0; i < Math.ceil(this.props.topics.length / 3); i++){
      topicList[i] = {"index":i, "topicName1":this.props.topics[i*3], "topicName2":this.props.topics[i*3+1], "topicName3":this.props.topics[i*3+2]};
        }
          
    
    return (
      
      <div className="trunk">
        <img className="trunk-svg" src={trunkSVG} />
        <div className="branch">
          {
              topicList.map( (topicList) => {
                return <Branch key={topicList.topicName1} topicList={topicList} />
              })
          }
        </div>
      </div>
    );
  }
});

module.exports = Trunk;
