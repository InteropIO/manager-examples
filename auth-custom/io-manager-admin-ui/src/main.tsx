import ReactDOM from 'react-dom';
import React, { StrictMode } from 'react';

import AdminUI from '@interopio/manager-admin-ui';

import '@interopio/theme-demo-apps';
import '@interopio/theme-demo-apps/dist/packages/rc-select.css';
import '@interopio/manager-admin-ui/dist/src/styles/index.css';
import '@ag-grid-community/core/dist/styles/ag-grid.css';

import { MyAuthProvider } from './MyAuthProvider';

ReactDOM.render(
  <StrictMode>
    <AdminUI
      apiURL="http://localhost:4356/api"
      theme="dark"
      baseName="admin"
      auth={new MyAuthProvider()}
    />
  </StrictMode>,
  document.getElementById('root')!
);
