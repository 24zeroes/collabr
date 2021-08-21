const proxy = require('http2-proxy')

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    "client/public": "/",
    "client/src": "/dist",
  },
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

        const defaultWebHandler = (err, req, res) => {
          if (err) {
            console.error('proxy error', err)
            finalhandler(req, res)(err)
          }
        }

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

        proxy.web(
          req, 
          res, 
          {
            hostname: 'localhost',
            port: 3000, 
          },
          defaultWebHandler
        );
      },
    },
    {
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
  ],
};