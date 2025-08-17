const path = require('path');

const config = {
  entry: './src', // default entry point is index.js in the src directory if file is not specified
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // default output filename is main.js
  },
  mode: 'production', // default mode is 'production'
};

module.exports = config;
