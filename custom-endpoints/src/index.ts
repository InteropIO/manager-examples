import { start, type Config } from '@interopio/manager';
import type { DataRequest } from '@interopio/manager-api';

void (async () => {
  const serverPort = 4356;

  const managerPort = 4357;
  const managerBase = 'api';

  const config: Config = {
    name: 'example',
    port: managerPort,
    base: managerBase,
    auth_method: 'none',
    auth_exclusive_users: ['admin'],
    store: {
      type: 'mongo',
      connection:
        'mongodb://db_user:Password123$@localhost:27017/io_manager?authSource=admin',
    },
    token: {
      secret: '<YOUR_SECRET>',
    },
  };

  const server = await start(config);

  const { getLogger } = await import('log4js');
  const proxyLogger = getLogger('proxy-logger');

  const { default: express } = await import('express');
  const { default: bodyParser } = await import('body-parser');
  const { default: cors } = await import('cors');
  const { createProxyMiddleware } = await import('http-proxy-middleware');

  const app = express();

  app.use(
    `/${managerBase}`,
    createProxyMiddleware({
      target: `http://localhost:${managerPort}/${managerBase}`,
      changeOrigin: false,
    })
  );

  app.use(cors());

  app.post('/custom/publish-layout', bodyParser.json(), async (req, res) => {
    try {
      const layoutQuery: DataRequest = {
        filter: {
          type: {
            type: 'equals',
            filterType: 'text',
            filter: req.body.layoutType,
          },
          name: {
            type: 'equals',
            filterType: 'text',
            filter: req.body.layoutName,
          },
          owner: {
            type: 'equals',
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

  app.listen(serverPort, () => {
    proxyLogger.log(`Proxy server started on ${serverPort}`);
  });
})().catch(console.error);
