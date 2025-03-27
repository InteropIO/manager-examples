import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import AdminUI from '@interopio/manager-admin-ui';

import '@interopio/manager-admin-ui/styles.css';

import { OktaAuth } from '@okta/okta-auth-js';

import {
  CustomOktaProvider,
  useCustomOktaProvider,
} from './CustomOktaProvider';

console.log(
  '[io.Manager Admin UI Auth] Initializing. location.href =',
  location.href
);

// TODO: Specify the appropriate okta client options here.
const oktaAuth = new OktaAuth({
  issuer: 'https://dev-10894256.okta.com/oauth2/default',
  clientId: '0oahnnb0tnrknGKUI5d7',

  redirectUri: location.origin + '/login/callback',
});

console.log('[io.Manager Admin UI Auth] SDK initialized.');

interface AppProps {
  baseName?: string;
}

export const App = ({ baseName }: AppProps) => {
  const authProvider = useCustomOktaProvider(baseName);
  return (
    <AdminUI
      apiURL="http://localhost:4356/api"
      theme="dark"
      baseName={baseName}
      auth={authProvider}
    />
  );
};

const baseName = 'admin';

const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  <StrictMode>
    <CustomOktaProvider oktaAuth={oktaAuth} baseName={baseName}>
      <App baseName={baseName} />
    </CustomOktaProvider>
  </StrictMode>
);
