import React from 'react';
import { render } from 'react-dom';
import routes from './routes';

var index = require("file?name=index.html!./public/index.html");

render(routes, document.getElementById('render-target'));
