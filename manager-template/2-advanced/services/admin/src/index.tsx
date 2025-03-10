import React from 'react';
import ReactDOM from 'react-dom';
import "@interopio/theme-demo-apps";
import "@interopio/theme-demo-apps/dist/packages/rc-select.css";
import "@interopio/manager-admin-ui/dist/src/styles/index.css";
import "@ag-grid-community/core/dist/styles/ag-grid.css";
import App from './app';

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);