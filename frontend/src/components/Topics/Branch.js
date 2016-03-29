import React from 'react';

import Topic from './Topic.js';

import config from '../../util/config.js';

import './topics.scss';

var leftBranchSVG, rightBranchSVG;

var leftBranchSVG1 = require('../../public/imgs/tree-branch-1.svg');
var leftBranchSVG2 = require('../../public/imgs/tree-branch-2.svg');
var leftBranchSVG3 = require('../../public/imgs/tree-branch-3.svg');
var leftBranchSVG4 = require('../../public/imgs/tree-branch-4.svg');

var rightBranchSVG1 = require('../../public/imgs/tree-branch-1-right.svg');
var rightBranchSVG2 = require('../../public/imgs/tree-branch-2-right.svg');
var rightBranchSVG3 = require('../../public/imgs/tree-branch-3-right.svg');
var rightBranchSVG4 = require('../../public/imgs/tree-branch-4-right.svg');



const Branch = React.createClass({
  render: function() {
    
    switch( Math.floor((Math.random() * 4) + 1) % 4 ){
              
      case 0: 
        leftBranchSVG = leftBranchSVG1;
        rightBranchSVG = rightBranchSVG1;
      break;

      case 1: 
        leftBranchSVG = leftBranchSVG2;
        rightBranchSVG = rightBranchSVG2;
      break;

      case 2: 
        leftBranchSVG = leftBranchSVG3;
        rightBranchSVG = rightBranchSVG3;
      break;

      case 3: 
        leftBranchSVG = leftBranchSVG4;
        rightBranchSVG = rightBranchSVG4;
      break;

    }
    
    if(this.props.topicList.index % 2 == 0){    
      
      if(this.props.topicList.topicName3 != undefined){
        return (
            <div className="left-branch">
              <img className="left-branch-image" src={leftBranchSVG} />
              <div className="left-branch-topic1">
                <Topic topicName={this.props.topicList.topicName1} />
              </div>
              <div className="left-branch-topic2">
                <Topic topicName={this.props.topicList.topicName2} />
              </div>
              <div className="left-branch-topic3">
                <Topic topicName={this.props.topicList.topicName3} />
              </div>
            </div>
        );
      }
      else if(this.props.topicList.topicName2 != undefined){
        return (
            <div className="left-branch">
              <img className="left-branch-image" src={leftBranchSVG} />
              <div className="left-branch-topic1">
                <Topic topicName={this.props.topicList.topicName1} />
              </div>
              <div className="left-branch-topic2">
                <Topic topicName={this.props.topicList.topicName2} />
              </div>
            </div>
        );
      }
      else{
        return (
            <div className="left-branch">
              <img className="left-branch-image" src={leftBranchSVG} />
              <div className="left-branch-topic1">
                <Topic topicName={this.props.topicList.topicName1} />
              </div>
            </div>
        );
        
      }
    }
    
    else if(this.props.topicList.index % 2 == 1){
      
      if(this.props.topicList.topicName3 != undefined){
        return (
           <div className="right-branch">
              <img className="right-branch-image" src={rightBranchSVG} />
              <div className="right-branch-topic1">
                <Topic topicName={this.props.topicList.topicName1} />
              </div>
              <div className="right-branch-topic2">
                <Topic topicName={this.props.topicList.topicName2} />
              </div>
              <div className="right-branch-topic3">
                <Topic topicName={this.props.topicList.topicName3} />
              </div>
            </div>
        );
      }
      else if(this.props.topicList.topicName2 != undefined){
        return (
           <div className="right-branch">
              <img className="right-branch-image" src={rightBranchSVG} />
              <div className="right-branch-topic1">
                <Topic topicName={this.props.topicList.topicName1} />
              </div>
              <div className="right-branch-topic2">
                <Topic topicName={this.props.topicList.topicName2} />
              </div>
            </div>
        );
      }
      else{
        return (
           <div className="right-branch">
              <img className="right-branch-image" src={rightBranchSVG} />
              <div className="right-branch-topic1">
                <Topic topicName={this.props.topicList.topicName1} />
              </div>
            </div>
        );
      }
    }
  }
});

module.exports = Branch;
