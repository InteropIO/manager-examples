import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import IODesktop, { type IOConnectDesktop } from '@interopio/desktop';

type IOConnectWindow = IOConnectDesktop.Windows.IOConnectWindow;

declare global {
  interface Window {
    iodesktop: any;
  }
}

function setUIMessage(message: string) {
  const element = document.getElementById('indicator')!;
  element.innerText = message;
}

function reportUnknownError(error: unknown) {
  console.error(error);

  const typedError = error as Error | { err: string };
  let message;

  if (!typedError) {
    message = 'Error: falsy error';
  } else if ('name' in typedError && 'message' in typedError) {
    message = `Error: ${typedError.name}: ${typedError.message}`;
  } else if ('err' in typedError) {
    message = `Error: ${typedError.err}`;
  } else {
    message = `Error: ${String(typedError)}`;
  }

  setUIMessage(message);
}

async function showSignInScreen(
  oktaAuth: OktaAuth,
  ioCDWindow: IOConnectWindow
) {
  setUIMessage('Signing in ...');

  console.log('[io.CD Auth] Showing the sign-in window.');
  await ioCDWindow.show();
  await ioCDWindow.focus();

  console.log('[io.CD Auth] Redirecting to the Okta sign-in page.');
  await oktaAuth.signInWithRedirect({
    // Pass the current relative url so that we get it in `restoreOriginalUri`
    // at the end of the flow.
    originalUri: location.pathname,
  });
}

async function setIOCDPlatformToken(
  oktaAuth: OktaAuth,
  ioCDWindow: IOConnectWindow
) {
  const user = await oktaAuth.getUser();

  const ioGlobal: any = window.iodesktop || window.glue42gd;

  console.log('[io.CD Auth] Setting the io.CD platform token.');
  ioGlobal.authDone({
    token: oktaAuth.getAccessToken(),
    user: user.sub,
  });

  if (ioCDWindow.isVisible) {
    console.log('[io.CD Auth] Hiding the sign-in window.');
    await ioCDWindow.hide();
  }
}

async function onAuthenticated(
  oktaAuth: OktaAuth,
  ioCDWindow: IOConnectWindow
) {
  console.log('[io.CD Auth] Starting auth tracking service. ');

  // Subscribe to authentication state changes.
  // This happens when the Okta SDK attempts to request new tokens
  // without any user action.
  oktaAuth.authStateManager.subscribe(async (newAuthState) => {
    console.log(
      '[io.CD Auth] Auth state changed. newAuthState.isAuthenticated =',
      newAuthState.isAuthenticated
    );

    try {
      // If the Okta authentication server allowed the session to be extended,
      // giving us new set of tokens.
      if (newAuthState.isAuthenticated) {
        await setIOCDPlatformToken(oktaAuth, ioCDWindow);

        // If the Okta authentication server declined to extend the session.
      } else {
        await showSignInScreen(oktaAuth, ioCDWindow);
      }
    } catch (error) {
      reportUnknownError(error);
    }
  });

  // Starts a timer that requests new tokens,
  // just before the current tokens are set to expire.
  //
  // This works for some time, after which the user must
  // start the authentication flow again.
  oktaAuth.start();

  // This is called here in case the above subscription doesnt fire
  // shortly after `oktaAuth.start` is called. This can happen on the redirect
  // back from the okta sign-in page.
  //
  // While this may result in sometimes calling `setIOCDPlatformToken(...)` twice,
  // it's better than sometimes not being called at all, which will result in
  // io.CD getting stuck and not being able to complete its initialization.
  await setIOCDPlatformToken(oktaAuth, ioCDWindow);

  setUIMessage('Authenticated.');
}

async function run() {
  console.log('[io.CD Auth] Initializing. location.href =', location.href);

  setUIMessage('Loading ...');

  // Initialize the io.CD SDK.
  // We need that to show and hide the current window.
  const io = await IODesktop();
  const ioCDWindow = io.windows.my()!;

  // Initialize the Okta SDK.
  const oktaAuth = new OktaAuth({
    // TODO: Specify the appropriate okta client options here.
    issuer: 'https://dev-10894256.okta.com/oauth2/default',
    clientId: '0oaitfid6useO6A4Q5d7',
    // Add the `offline_access` scope in order to get a refresh token.
    scopes: ['openid', 'email', 'profile', 'offline_access'],

    redirectUri: location.origin + '/login/callback',
    restoreOriginalUri: async (_oktaAuth, originalUri) => {
      console.log(
        '[io.CD Auth] Restoring original url. originalUri =',
        originalUri
      );

      // Restore the url that was in place when the page was redirected
      // to the okta sign-in page.
      history.replaceState(
        null,
        '',
        toRelativeUrl(originalUri || '/', location.origin)
      );
    },
  });

  console.log('[io.CD Auth] SDKs initialized.');

  // If the page is loaded after a redirect back from the Okta sign-in page.
  if (oktaAuth.isLoginRedirect()) {
    console.log('[io.CD Auth] Handling redirect.');

    await oktaAuth.handleRedirect();
    await onAuthenticated(oktaAuth, ioCDWindow);

    // If there is an active session. (Stored in browser storage.)
  } else if (await oktaAuth.isAuthenticated()) {
    console.log('[io.CD Auth] Authenticated on initialization.');

    await onAuthenticated(oktaAuth, ioCDWindow);

    // If there is no active session.
  } else {
    console.log('[io.CD Auth] Not authenticated on initialization.');
    await showSignInScreen(oktaAuth, ioCDWindow);
  }
}

run().catch(reportUnknownError);
