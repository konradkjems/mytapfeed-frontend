const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
      headers: {
        Connection: 'keep-alive'
      },
      onProxyReq: function(proxyReq, req, res) {
        // Log proxy request
        console.log('Proxying:', {
          method: req.method,
          path: req.path,
          target: 'http://localhost:3000' + req.path
        });
      },
      onError: function(err, req, res) {
        console.error('Proxy error:', err);
      }
    })
  );
}; 