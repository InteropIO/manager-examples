# Introduction

This example demonstrates how to configure an io.Manager instance using environment variables.

If configuration object is not provided when io.Manager is started, it will read its configuration from environment variables. 

Additionally, environment variables will be read from the [.env](./.env) file (located in the current working directory) if such file exists.

# Prerequisites

### Database

io.Manager requires a database to connect to - this example uses MongoDB, but you can use any other of the supported databases. You will need to either have a local instance or setup a remote database to connect to. For more information visit our Documentation page on the subject: https://docs.interop.io/manager/databases/overview/index.html

### License

**io.Manager** requires a license key to operate. To acquire a license key, contact us at `sales@interop.io`.

# How to run

- Install npm packages

```sh

npm install

```

- Start the server

```sh

npm run start

```
