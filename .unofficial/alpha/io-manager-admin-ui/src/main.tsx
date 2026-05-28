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
      auth="none"
      // This will be the user that anyone accessing the Admin UI
      // will be logged in as, unless they are accessing the Admin UI from io.Connect Desktop,
      // in which case the local machine username will be used instead.
      authUser="admin"
    />
  </StrictMode>
);
