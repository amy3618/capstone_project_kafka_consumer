import React from 'react';
import { Link, hashHistory } from 'react-router';

import config from '../../util/config.js';
import Trunk from './Trunk.js';
import Header from '../Header/Header.js';
import './topics.scss';

const Topics = React.createClass({
  getInitialState: function() {
    // TODO Get topics from backend
    return {
      topics: []
    }
  },

  componentDidMount() {

    // Get list of topics from server
    var request = new XMLHttpRequest();
    request.open('GET', config.SERVER_URL + '/topics');

    request.onload = (function() {
      var topics = JSON.parse(request.responseText);
      this.setState({ topics: topics });
    }).bind(this);

    request.send();

    // Sky color
    document.body.style.background = "#ecfaf9";
  },

  render: function() {
    
    //List of test topics
    //var testList = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10"];
    
    return (      
      <div>
        <Header title="Topics"/>
        <Trunk topics={this.state.topics}/>
      </div>
    );
  }
});

export default Topics;