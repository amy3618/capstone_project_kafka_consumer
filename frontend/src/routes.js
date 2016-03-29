import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';

import App from './components/App/App.js';
import Topics from './components/Topics/Topics.js';
import Messages from './components/Messages/Messages.js';
import KeywordMessageList from './components/Messages/KeywordMessageList.js';
import SearchMessageList from './components/Messages/SearchMessageList.js';

const routes = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Topics} />
      <Route path="/topics" component={Topics} />
      <Route path="/topics/:topicId" component={Messages} />
      <Route path="/topics/:topicId/messages/:keyword" component={KeywordMessageList} />
      <Route path="/topics/:topicId/messages" component={KeywordMessageList} />
      <Route path="/topics/:topicId/search/:searchTerm" component={SearchMessageList} />
    </Route>
  </Router>
)

export default routes;
