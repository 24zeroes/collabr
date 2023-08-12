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
      src: '/ws',
      upgrade: (req, socket, head) => {

        const defaultWSHandler = (err, req, socket, head) => {
          if (err) {
            console.error('proxy error', err);
            socket.destroy();
          }
        };

        proxy.ws(
          req,
          socket,
          head,
          {
            hostname: 'localhost',
            port: 7071,
          },
          defaultWSHandler,
        );
      },
    },
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