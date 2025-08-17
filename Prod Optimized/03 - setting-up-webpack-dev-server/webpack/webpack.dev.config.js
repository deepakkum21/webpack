const common = require('./webpack.common.config.js');
const { merge } = require('webpack-merge');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    port: 9000, // Port for the dev server
    static: {
      directory: path.resolve(__dirname, '..'), // Serve static files from the root directory
    },
    devMiddleware: {
      // Serve files from memory
      index: 'index.html', // Serve index.html as the default file
      writeToDisk: true, // Write files to disk
    },
    client: {
      overlay: true, // Show errors and warnings in the browser overlay
    },
    liveReload: false, // Disable live reloading
  },
});
