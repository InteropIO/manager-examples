import AdminUI from '@interopio/manager-admin-ui';

import '@interopio/theme-demo-apps';
import '@interopio/theme-demo-apps/dist/packages/rc-select.css';
import '@interopio/manager-admin-ui/dist/src/styles/index.css';
import '@ag-grid-community/core/dist/styles/ag-grid.css';

import './styles.css';

export const App = () => {
  return (
    <AdminUI
      apiURL="http://localhost:4356/api"
      theme="dark"
      baseName="admin"
      auth="okta"
      // TODO: Specify the appropriate okta client options here.
      auth_okta={{
        issuer: 'https://dev-10894256.okta.com/oauth2/default',
        clientId: '0oahnnb0tnrknGKUI5d7',

        redirectUri: location.origin + '/login/callback',
      }}
    />
  );
};
