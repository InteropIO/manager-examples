import ReactDOM from "react-dom";
import React, { StrictMode } from "react";

import AdminUI from "@interopio/manager-admin-ui";

import "@interopio/theme-demo-apps";
import "@interopio/theme-demo-apps/dist/packages/rc-select.css";
import "@interopio/manager-admin-ui/dist/src/styles/index.css";
import "@ag-grid-community/core/dist/styles/ag-grid.css";

ReactDOM.render(
  <StrictMode>
    <AdminUI
      baseName="admin"
      apiURL="/server"
      theme="dark"
      auth="none"
      // This will be the user that anyone accessing the Admin UI
      // will be logged in as, unless they are accessing the Admin UI from io.Connect Desktop,
      // in which case the local machine username will be used instead.
      authUser="admin"
    />
  </StrictMode>,
  document.getElementById("root")!,
);
