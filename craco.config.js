const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "fs": false,
          "path": false,
          "os": false,
          "crypto": false,
          "stream": false,
          "buffer": false,
          "http": false,
          "https": false,
          "zlib": false,
          "async_hooks": false,
          "net": false,
          "tls": false,
          "child_process": false,
          "constants": false
        }
      }
    }
  },
  devServer: {
    port: 3001
  }
}; 