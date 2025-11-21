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
      auth="okta"
      // TODO: Specify the appropriate okta client options here.
      auth_okta={{
        issuer: 'https://integrator-3447223.okta.com/oauth2/default',
        clientId: '0oaxn4evpozCU2H6P697',

        redirectUri: location.origin + '/admin/callback',
      }}
    />
  </StrictMode>
);
