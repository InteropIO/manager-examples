import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { OktaAuth, toRelativeUrl, type AuthState } from '@okta/okta-auth-js';
import { LoginCallback, Security, useOktaAuth } from '@okta/okta-react';
import type { AuthProvider } from '@interopio/manager-admin-ui';

interface OktaProviderProps {
  oktaAuth: OktaAuth;
  baseName?: string;
  children: ReactNode;
}

/**
 * This component is a wrapper around `Security` that initiates login via redirect
 * and only renders its children when the user has authenticated.
 *
 * This is done because if we render the AdminUI before the browser is redirected to the original url,
 * `react-router-dom will` not detect a url change via `history.replaceState` and instead
 * we will have to do a top level navigation via `location.href = ...`.
 *
 * TLDR: We authenticate before we render so that we don't have an extra page refresh.
 * @param oktaAuth
 * @param defaultOriginalUrl
 * @param children
 */
export const CustomOktaProvider = ({
  oktaAuth,
  baseName,
  children,
}: OktaProviderProps) => {
  const [authState, setAuthState] = useState<AuthState | null>(null);

  const restoreOriginalUri = useCallback(
    (_oktaAuth: OktaAuth, originalUri: string) => {
      console.log(
        '[io.Manager Admin UI Auth] Restoring original url. originalUri =',
        originalUri
      );

      history.replaceState(
        null,
        '',
        toRelativeUrl(originalUri || `/${baseName ?? ''}`, location.origin)
      );
    },
    [baseName]
  );

  const signInInProgressRef = useRef(false);

  useEffect(() => {
    // authState has not initialized yet.
    // This may stay this way for a few renders while the provider is being setup.
    if (!authState) {
      return;
    }

    // If we are on the redirect url of our app - let `LoginCallback` do its work.
    // After that `restoreOriginalUri` will be called and will redirect to the correct place iun our app.
    // We don't use `oktaAuth.isLoginRedirect()` here, because it also checks
    // for the data in the url that may have been cleaned up by `LoginCallback` at this point in time.
    if (isRedirectUri(oktaAuth)) {
      console.log(
        '[io.Manager Admin UI Auth] CustomOktaProvider effect - Redirect handled.'
      );
      return;
    }

    if (!authState.isAuthenticated) {
      console.log(
        '[io.Manager Admin UI Auth] CustomOktaProvider effect - Not authenticated.'
      );

      // If we have not initiated a redirect already.
      if (!signInInProgressRef.current) {
        // It's ok that we never flip it back to false because this happens immediately before top level navigation.
        // The point is that we don't call `signInWithRedirect` more that once.
        signInInProgressRef.current = true;

        console.log(
          '[io.Manager Admin UI Auth] CustomOktaProvider effect - Redirecting to the Okta sign-in page.'
        );
        void oktaAuth.signInWithRedirect({
          // Where to redirect back to after auth is done. Will be passed to `restoreOriginalUri`.
          originalUri: location.pathname,
        });
      }
    }
  }, [authState?.isAuthenticated, oktaAuth]);

  if (isLogOutUrl(baseName)) {
    console.log(
      '[io.Manager Admin UI Auth] OktaAuthProvider render - Logged out page.'
    );
    return <LoggedOutPage baseName={baseName} />;
  }

  console.log(
    '[io.Manager Admin UI Auth] CustomOktaProvider render -',
    !authState
      ? 'Auth state not initialized.'
      : authState.isAuthenticated
        ? 'Authenticated.'
        : 'Not authenticated.'
  );

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <OktaConsumer onAuthStateChange={setAuthState} />
      {!authState?.isAuthenticated && (
        <LoginCallback loadingElement={<div>Loading...</div>} />
      )}
      {authState?.isAuthenticated && children}
    </Security>
  );
};

function isRedirectUri(oktaAuth: OktaAuth): boolean {
  // This should exist if correctly configured.
  if (!oktaAuth.options.redirectUri) {
    throw new Error('oktaAuth.options.redirectUri is falsy');
  }

  return location.href.startsWith(oktaAuth.options.redirectUri);
}

function getLogOutUrl(baseName?: string) {
  return `${location.origin}${baseName ? `/${baseName}` : ''}/logout`;
}

function isLogOutUrl(baseName?: string) {
  return location.href.startsWith(getLogOutUrl(baseName));
}

interface LoggedOutPageProps {
  baseName?: string;
}

function LoggedOutPage({ baseName }: LoggedOutPageProps) {
  const handleOnLogin = useCallback(() => {
    location.href = `${location.origin}/${baseName ?? ''}`;
  }, [baseName]);

  return (
    <div className="h-100 d-flex flex-column justify-content-center align-items-center gap-2">
      <div>You have been logged out.</div>

      <button type="button" className="btn btn-primary" onClick={handleOnLogin}>
        Log back in
      </button>
    </div>
  );
}

interface OktaConsumerProps {
  onAuthStateChange: (authState: AuthState | null) => void;
}

/**
 * This only exists to call `useOktaAuth()` and push `authState` to its parent.
 * @param onAuthStateChange
 */
function OktaConsumer({ onAuthStateChange }: OktaConsumerProps) {
  const { authState } = useOktaAuth();
  useEffect(() => {
    onAuthStateChange(authState);
  }, [authState, onAuthStateChange]);
  return null;
}

export const useCustomOktaProvider = (baseName?: string) => {
  const { oktaAuth } = useOktaAuth();

  return useMemo<AuthProvider>(() => {
    return {
      // The rules for provider.
      addCredentialsToRequest: false,
      addTokenToRequest: true,
      addUsernameToRequest: false,

      getAccessToken: async () => {
        console.log(
          '[io.Manager Admin UI Auth] useCustomOktaProvider - Calling getAccessToken()'
        );

        return oktaAuth.getAccessToken();
      },

      getUserInfo: async () => {
        console.log(
          '[io.Manager Admin UI Auth] useCustomOktaProvider - Calling getUserInfo()'
        );

        const user = await oktaAuth.getUser();
        return { id: user.sub };
      },

      // This should technically never get called, because the user is authenticated
      // before this hook runs, but we implement it anyway.
      loginIfNeeded: async () => {
        console.log(
          '[io.Manager Admin UI Auth] useCustomOktaProvider - Calling loginIfNeeded()'
        );

        await oktaAuth.signInWithRedirect({
          // Where to redirect back to after auth is done. Will be passed to `restoreOriginalUri`.
          originalUri: location.pathname,
        });
      },

      logOut: async () => {
        console.log(
          '[io.Manager Admin UI Auth] useCustomOktaProvider - Calling logOut()'
        );

        await oktaAuth.signOut({
          postLogoutRedirectUri: getLogOutUrl(baseName),
        });
      },

      // If this hook runs, we are already authenticated.
      // Loading and error state are handled in `OktaProvider`.
      isAuthenticated: true,
      isLoading: false,
      error: undefined,
    };
  }, [oktaAuth, baseName]);
};
