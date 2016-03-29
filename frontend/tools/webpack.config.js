var webpack = require('webpack');
var path = require('path');

var clientConfig = {
  entry: './src/client.js',
  output: {
    path: './build/public',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader?limit=8192'
      }
    ]
  }
};

module.exports = clientConfig;
