import {
  type Config,
  type DataRequest,
  start,
  TextFilterType,
} from '@interopio/manager';

void (async () => {
  const managerPort = 4357;
  const managerBase = 'api';

  const config: Config = {
    name: 'example',
    port: managerPort,
    base: managerBase,
    // TODO: Contact us at sales@interop.io to acquire a license key.
    licenseKey: '<YOUR_LICENSE_KEY>',
    auth_method: 'none',
    auth_exclusive_users: ['admin'],
    skipProcessExitOnStop: false,
    store: {
      type: 'mongo',
      // TODO: Replace this with your own MongoDB connection string.
      connection:
        'mongodb://db_user:Password123$@localhost:27017/io_manager?authSource=admin',
    },
    token: {
      // TODO: Replace this with your secret.
      secret: '<YOUR_SECRET>',
    },
  };

  // Start io.Manager on port 4357
  const server = await start(config);

  const { getLogger } = await import('log4js');
  const proxyLogger = getLogger('proxy-logger');

  const express = await import('express');
  const bodyParser = await import('body-parser');
  const cors = await import('cors');
  const { createProxyMiddleware } = await import('http-proxy-middleware');

  // Create a separate express HTTP server
  const app = express();

  // Enable CORS
  app.use(cors());

  // Use reverse-proxy middleware to forward traffic:
  //
  // From: http://localhost:4356/api (the proxy server)
  // To:   http://localhost:4357/api (io.Manager server)
  app.use(
    `/${managerBase}`,
    createProxyMiddleware({
      target: `http://localhost:${managerPort}/${managerBase}`,
      changeOrigin: true,
    })
  );

  // Implement any custom endpoints.
  // Example body:
  // {
  //     "layoutType": "Global",
  //     "layoutName": "test123",
  //     "username": "admin"
  // }
  app.post('/custom/publish-layout', bodyParser.json(), async (req, res) => {
    try {
      // Use the `server` object received by starting io.Manager to interface with it
      // by calling the io.Manager controllers directly.
      const layoutQuery: DataRequest = {
        filter: {
          type: {
            type: TextFilterType.equals,
            filterType: 'text',
            filter: req.body.layoutType,
          },
          name: {
            type: TextFilterType.equals,
            filterType: 'text',
            filter: req.body.layoutName,
          },
          owner: {
            type: TextFilterType.equals,
            filterType: 'text',
            filter: req.body.username,
          },
        },
      };

      const response = await server.layouts.getAllLayouts(
        JSON.stringify(layoutQuery)
      );

      const layout = response.items[0];

      if (!layout) {
        res.sendStatus(404);
        return;
      }

      layout.owner = '*';
      layout.public = true;

      await server.layoutsV2.updateLayout(layout);

      res.sendStatus(204);
    } catch (error) {
      proxyLogger.error('An error occurred while publishing a layout.', error);
      res.sendStatus(500);
    }
  });

  const proxyServerPort = 4356;

  // Start the proxy server on port 4356
  app.listen(proxyServerPort, () => {
    proxyLogger.log(`Proxy server started on ${proxyServerPort}`);
  });
})().catch(console.error);
