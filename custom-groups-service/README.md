# Introduction

An example that demonstrates how to provide a custom Groups service to **io.Manager**.

# Custom Groups service

By default **io.Manager** stores groups and resolves the groups a user belongs to using its internal Groups Service implementation. Providing a custom Groups service through the `groups_service` configuration property replaces that with your own implementation.

A custom Groups service implements the `GroupsService` interface exported from `@interopio/manager`. Its `getSupportedFeatures()` method declares which operations the implementation supports - **io.Manager** invokes a group management operation only when the corresponding capability flag is `true`, so an implementation that only reads groups can report `false` for the write operations and leave those methods as stubs.

This example implements [MyGroupsService](./src/MyGroupsService.ts) as a thin adapter over the in-memory stores in [data.ts](./src/data.ts) that stand in for an external system.

For an example that combines a custom Groups service with a custom authenticator, see the [auth-custom](../auth-custom) example.

# Prerequisites

### Database

io.Manager requires a database to connect to - this example uses MongoDB, but you can use any other of the supported databases. You will need to either have a local instance or setup a remote database to connect to. For more information visit our Documentation page on the subject: https://docs.interop.io/manager/databases/overview/index.html

### License

**io.Manager** requires a license key to operate. To acquire a license key, contact us at `sales@interop.io`.

# How to run

- Install npm packages

```sh

npm install

npm audit fix

```

- Start the server

```sh

npm run start

```
