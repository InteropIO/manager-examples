import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import AdminUI from '@interopio/manager-admin-ui';

import '@interopio/manager-admin-ui/styles.css';

const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  <StrictMode>
    <AdminUI
      apiURL="http://localhost:4356/api"
      theme="dark"
      baseName="admin"
      auth="auth0"
      auth_auth0={{
        // TODO: Replace this with your Domain.
        domain: 'dev-vccmw066d2ot7rcj.eu.auth0.com',

        // TODO: Replace this with your Client ID.
        clientId: 'sBOb36xUhNOZtLetV0JHIIfHYXTG4kkr',

        authorizationParams: {
          audience: 'http://localhost:4356/api',
          redirectUri: 'http://localhost:3000/admin/callback',
        },
        cacheLocation: 'localstorage',
        useRefreshTokens: true,
      }}
    />
  </StrictMode>
);
