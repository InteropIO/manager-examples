# io.Manager custom authentication example (using Okta)

**NOTE: This is an example implementation of custom authentication and authorization for io.Manager that just happens to be using Okta. io.Manager has out of the box support for Okta authentication/authorization. An example can be found here: [auth-okta](../auth-okta)


## Prerequisites

_**Setup MongoDB or another database**_

io.Manager requires a database to connect to - this example uses MongoDB, but you can use any other of the supported databases. You will need to either have a local instance or setup a remote database to connect to. For more information visit our Documentation page on the subject: https://docs.interop.io/manager/databases/overview/index.html

_**Setup access to interop.io Artifactory**_

Before you begin you need to add _.npmrc_ files with the following content into _io-manager-server_ and _io-manager-admin-ui_ directories (placeholders can be filled in after setting up JFrog account)

```sh
@interopio:registry=https://glue42.jfrog.io/artifactory/api/npm/default-npm-virtual/
//glue42.jfrog.io/artifactory/api/npm/:_auth=<COPY_FROM_JFROG_SETUP>
//glue42.jfrog.io/artifactory/api/npm/default-npm-virtual/:username=<COPY_FROM_JFROG_SETUP>
//glue42.jfrog.io/artifactory/api/npm/default-npm-virtual/:email=<COPY_FROM_JFROG_SETUP>
//glue42.jfrog.io/artifactory/api/npm/default-npm-virtual/:always-auth=true
```

# Okta Setup

This example contains both io.Manager Admin UI and io.Connect Desktop integrations. You can use one or both.

### io.Manager Admin UI

In your Okta admin panel go to the **Applications** menu and select **Create App Integration**.

When asked, select **OIDC - OpenID Connect** for the **Sign-in method** and **Single-Page Application** for the **Application type**.

Make sure to enter the correct redirect urls for the applications. In this development setup io.Manager Admin UI is served on `http://localhost:8080`.

### io.Connect Desktop

In your Okta admin panel go to the **Applications** menu and select **Create App Integration**.

When asked, select **OIDC - OpenID Connect** for the **Sign-in method** and **Single-Page Application** for the **Application type**.

Click the **Refresh Token** checkbox under **Grant type** and **Core grants**. 

Make sure to enter the correct redirect urls for the applications. In this development setup the io.Connect Desktop login page is served on `http://localhost:3000`.

# How to run

### io.Manager

- Navigate to the `io-manager-server` directory.

- Open `src/index.ts` and replace the MongoDB connection string and token secret with your own. Look for the `TODO` comments.

- Open `src/CustomOktaAuthenticator.ts` and fill out the okta verifier options and audiences. Look for the `TODO` comments.

- Run the following commands to restore the npm packages and start the server:

```sh

npm install

npm run start

```

### io.Manager Admin UI

- Navigate to the `io-manager-admin-ui` directory.

- Open `src/main.tsx` and fill out the okta client options. Look for the `TODO` comments.

- Run the following commands to restore the npm packages and start the application:

```sh

npm install

npm run start

```

### io.Connect Desktop sign-in page

- Navigate to the `io-cd-login` directory.

- Open `src/main.ts` and fill out the okta client options. Look for the `TODO` comments.

- Run the following commands to restore the npm packages and start the application:

```sh

npm install

npm run start

```

# io.Connect Desktop configuration

### Configure io.Connect Desktop to connect to io.Manager

To configure io.Connect Desktop to connect to io.Manager, add the following configuration in `system.json`:

```json
{
  // other configuration above
  // copy from here....
  "server": {
    "enabled": true,
    "url": "http://localhost:4356/api"
  }
  // ...to here
}
```

This will add the Server as an additional application store. If you want the io.Manager Server to be the only app store, set the "appStores" top-level key to an empty array.

This will also instruct io.Connect Desktop to store Layouts and Application Preferences on the io.Manager Server.

### Configure io.Connect Desktop to use the okta sign-in page

To configure io.Connect Desktop to use the okta sign-in page add the following configuration in `system.json`:

```json
{
  // other configuration above
  // copy from here....
  "ssoAuth": {
    "authController": "sso",
    "options": {
      "url": "http://localhost:3000/",
      "keepAlive": true,
      "window": {
        "width": 540,
        "height": 660,
        "mode": "flat"
      }
    }
  }
  // ...to here
}
```

# io.Manager Groups

io.Manager uses groups to assign applications and layouts to users.

The special `GLUE42_SERVER_ADMIN` group is used to grant users admin permissions (required to access the io.Manager Admin UI).

This example does not include io.Manager group mapping. It is left to the implementer to decide where each user's groups come from.

Possible implementation may include:

- Reading the groups from a custom claim in the access token.
- Getting the groups from an external API.

This example assigns all users the to the `GLUE42_SERVER_ADMIN` group, this is done to demonstrate the okta integration for the io.Manager Admin UI. In production environments, not all users should have admin access.