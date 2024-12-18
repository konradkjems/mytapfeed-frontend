const webpack = require('webpack');

module.exports = {
  // ... andre webpack konfigurationer
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert/"),
      "util": require.resolve("util/"),
      "buffer": require.resolve("buffer/"),
      "process": require.resolve("process/browser"),
      "zlib": false,
      "http": false,
      "https": false,
      "net": false,
      "tls": false,
      "crypto": false,
      "os": false,
      "fs": false,
      "readline": false,
      "child_process": false
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ]
}; 