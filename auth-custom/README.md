# io.Manager with Custom Authenticator Example

This example demonstrates how to customize io.Manager with a custom **authenticator** and a custom **groups service**.

We will also start a customized Admin UI and configure io.Connect Desktop to use a custom Login Screen.

_Note that for the simplicity of the example we will use tokens that encode the username; in a real world scenario you should leverage the auth flow to an identity platform_

## Customizing io.Manager Server

In the server you can create a custom authenticator by implementing the `Authenticator` interface. The **authenticator** is responsible for processing every income request and authenticating the user based on data from the request.

Once you have implemented the **authenticator** you can pass it to the server initialization options.

After you don this each request to the server will goes through the custom **authenticator** that should authenticate/authorize the user. Usually the **authenticator** would use a 3-rd party lib to validate the request (by validating token, using sspi libs, etc);

If successful the **authenticator** must return an object corresponding the user making the request. This object contains the user **id** and an array of **groups** that this user belongs to. Based on those groups the server determines the list of applications and layouts that should be returned to the user.

In this example the "token" passed to the server is simply the username encoded in the following format `user:<USERNAME>`; The list of initial users & groups are hardcoded [data.ts](./io-manager-server/src/data.ts).

To start the example server follow the [instructions](./io-manager-server/README.md) in the server folder.

## Adding a Custom Login Screen

io.Connect Desktop allows showing a login screen before the first application is loaded. This page should authenticate the user and signal io.Connect Desktop that the authentication process is complete.

In this example the login page contains a single email field and produces a "token" based on the submitted email.

To start the example login page follow the [instructions](./io-cd-login/README.md) in the server folder.

For more info on customizing the login screen check our docs [Login Screen](https://docs.interop.io/desktop/getting-started/how-to/rebrand-io-connect/functionality/index.html#login_screen).

## Configure io.Connect Desktop

You will then need to configure io.Connect Desktop to connect to the server and use the custom login screen.

To do this you should edit the _system.json_ file of io.Connect Desktop located in _%LocalAppData%\interop.io\io.Connect Desktop\config_

**To connect to io.Manager Server:**
To configure io.Connect Desktop to connect to the example server, use the "server" top-level key. Add the following configuration to enable connection to the io.Manager Server:

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

**To use a custom login screen:**
To enable the custom login screen, use the "ssoAuth" top-level key

```json
{
  // other configuration above
  // copy from here....
  "ssoAuth": {
    "authController": "sso",
    "options": {
      "url": "http://localhost:9123/",
      "window": {
        "width": 400,
        "height": 550,
        "mode": "flat"
      }
    }
  }
  // ...to here
}
```

**Remove any other appStores**
To remove the default app stores, set the "appStores" top-level key to an empty array.

```json
{
  // other configuration above
  // copy from here....
  "appStores": []
  // ...to here
}
```

## Protecting the Admin UI with a login page

In this example the Administrative UI is customized with a [custom **authenticator**](./io-manager-admin-ui/src/MyAuthProvider.ts). The authenticator re-directs to the login page. After the user log-ins the login sends back the generated token as a query param. Then **Admin UI** then uses this token for calls to the server.
**Note that this example is for demonstrative purposes and should not be used in production.**

To access **Admin UI** users must belong to a special group (**GLUE42_SERVER_ADMIN**). Check [data.ts](./io-manager-server/src/data.ts) for the list of users that have that group and use one of them to login.

To start the Admin UI follow the [instructions](./io-manager-admin-ui/README.md) in the admin-ui folder.

In a real world scenario you have the following options to protect admin-ui:

1. Implement a custom authenticator;
   1. Implement a custom login react based login component that will authenticate the user against an in-house service and provide the token to the custom authenticator
   2. Re-use existing login page and extract the token in the custom authenticator once the user is authenticated
2. Put the Admin UI behind a reverse proxy that would handle the authentication and pass the user info to the server
