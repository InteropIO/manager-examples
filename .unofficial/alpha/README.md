# io.Manager Alpha Channel Example (Unofficial)

This example mirrors the `auth-none` example but pins **io.Manager** to the `alpha`
npm dist-tag, so each `npm install` picks up the latest alpha cut. It lives under
`.unofficial/` because it is not part of the official examples set — it is excluded
from the root npm workspaces (the `**` glob ignores dot-prefixed directories) and
is not listed in the root `README.md`. Install and run each sub-package standalone.

## Prerequisites

### Database

io.Manager requires a database to connect to - this example uses MongoDB, but you can use any other of the supported databases. You will need to either have a local instance or setup a remote database to connect to. For more information visit our Documentation page on the subject: https://docs.interop.io/manager/databases/overview/index.html

### License

**io.Manager** requires a license key to operate. To acquire a license key, contact us at `sales@interop.io`.

# How to run

### io.Manager

- Navigate to the `io-manager-server` directory.

- Run the following commands to install the npm packages and start the server:

```sh

npm install

npm audit fix

npm run start

```

### io.Manager Admin UI

- Navigate to the `io-manager-admin-ui` directory.

- Run the following commands to install the npm packages and start the application:

```sh

npm install

npm audit fix

npm run start

```

- The Admin UI can be found at http://localhost:3000/admin

- You will be logged in automatically.
