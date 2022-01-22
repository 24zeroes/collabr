const proxy = require('http2-proxy');
const dotenv = require('dotenv-webpack');

module.exports = {
  mount: {
    "client/public": "/",
    "client/src": "/dist/",
  },
  plugins: [
    [
      '@snowpack/plugin-webpack',
      {
      },
    ],
  ],
  routes: [
    {
      match: 'all',
      src: '/api/.*',
      dest: (req, res) => {
        // remove /api prefix (optional)
        req.url = req.url.replace("api/", '');
        return proxy.web(req, res, {
          hostname: 'localhost',
          port: 3000,
        });
      },
    },
    {
      match: 'routes',
      src: '.*',
      dest: '/index.html',
    },
  ],
};