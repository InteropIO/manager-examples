// Parcel-specific workaround: Parcel's dev server renders a full-screen
// `<parcel-error-overlay>` whenever React calls `console.error` for a
// deprecation warning, even though the page itself works. The warnings come
// from vendored dependencies inside `@interopio/manager-admin-ui` (reactstrap
// and friends) and are harmless. Other bundlers in this folder don't have
// this overlay aggression - they log the same warnings quietly to the
// console - so this filter is intentionally parcel-only and is installed
// before any import that could trigger the warnings.
const originalConsoleError = console.error;

const suppressedWarningSubstrings = [
  'defaultProps will be removed',
  'non-boolean attribute',
  'Failed %s type',
];

console.error = (...args: unknown[]) => {
  const firstArg = args[0];

  if (
    typeof firstArg === 'string' &&
    suppressedWarningSubstrings.some((substring) =>
      firstArg.includes(substring)
    )
  ) {
    return;
  }

  originalConsoleError(...args);
};

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import AdminUI from '@interopio/manager-admin-ui';

import '@interopio/manager-admin-ui/styles.css';

const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  <StrictMode>
    <AdminUI
      // TODO: Replace this with the URL of your own io.Manager server.
      apiURL="http://localhost:4356/api"
      theme="dark"
      baseName="admin"
      auth="none"
      // This will be the user that anyone accessing the Admin UI
      // will be logged in as, unless they are accessing the Admin UI from io.Connect Desktop,
      // in which case the local machine username will be used instead.
      authUser="admin"
    />
  </StrictMode>
);
