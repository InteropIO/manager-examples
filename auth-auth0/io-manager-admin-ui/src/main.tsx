import ReactDOM from 'react-dom';
import React, { StrictMode } from 'react';

import AdminUI from '@interopio/manager-admin-ui';

import '@interopio/theme-demo-apps';
import '@interopio/theme-demo-apps/dist/packages/rc-select.css';
import '@interopio/manager-admin-ui/dist/src/styles/index.css';
import '@ag-grid-community/core/dist/styles/ag-grid.css';

import './styles.css';

ReactDOM.render(
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
        clientId: 'Bq9dgFBMobH7iRS8mwiRq2QtJd3KOVJw',

        audience: 'http://localhost:4356/api',
        redirectUri: 'http://localhost:8080/login/callback',
        cacheLocation: 'localstorage',
        useRefreshTokens: true,
      }}
    />
  </StrictMode>,
  document.getElementById('root')!
);
