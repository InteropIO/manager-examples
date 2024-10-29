import ReactDOM from 'react-dom';
import React, { StrictMode } from 'react';

import { OktaAuth } from '@okta/okta-auth-js';

import { App } from './App';
import { CustomOktaProvider } from './CustomOktaProvider';

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

const baseName = 'admin';

ReactDOM.render(
  <StrictMode>
    <CustomOktaProvider oktaAuth={oktaAuth} baseName={baseName}>
      <App baseName={baseName} />
    </CustomOktaProvider>
  </StrictMode>,
  document.getElementById('root')!
);
