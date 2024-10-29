import AdminUI from '@interopio/manager-admin-ui';
import React from 'react';

import '@interopio/theme-demo-apps';
import '@interopio/theme-demo-apps/dist/packages/rc-select.css';
import '@interopio/manager-admin-ui/dist/src/styles/index.css';
import '@ag-grid-community/core/dist/styles/ag-grid.css';

import './styles.css';

import { useCustomOktaProvider } from './CustomOktaProvider';

interface AppProps {
  baseName?: string;
}

export const App = ({ baseName }: AppProps) => {
  const authProvider = useCustomOktaProvider(baseName);

  return (
    <>
      <AdminUI
        apiURL="http://localhost:4356/api"
        theme="dark"
        baseName={baseName}
        auth={authProvider}
      />
    </>
  );
};
