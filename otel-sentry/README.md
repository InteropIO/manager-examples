# Introduction

An example that shows how setup **io.Manager** to send OpenTelemetry traces to Sentry.

# Prerequisites

### Database

io.Manager requires a database to connect to - this example uses MongoDB, but you can use any other of the supported databases. You will need to either have a local instance or setup a remote database to connect to. For more information visit our Documentation page on the subject: https://docs.interop.io/manager/databases/overview/index.html

### License

**io.Manager** requires a license key to operate. To acquire a license key, contact us at `sales@interop.io`.

# Sentry account

For this example, you will need a Sentry account. If you don't have one, you can sign up at https://sentry.io/signup/.

You will need to set up a Sentry project and obtain a DSN (Data Source Name) to configure the integration.

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
