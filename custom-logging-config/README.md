# Introduction

An example that demonstrates how to pass custom logging configuration to **io.Manager**.

# Custom logging config

**io.Manager** uses [log4js](https://log4js-node.github.io/log4js-node/) for logging.

When started, **io.Manager** will try to load [log4js](https://log4js-node.github.io/log4js-node/) configuration file from `./config/logger.json` (relative to the working directory of the process). If not found it will default to a hardcoded configuration that will write logs into the `./logs` directory (relative to the working directory of the process).

This example uses a [custom log4js config](./config/logger.json) to change the logging directory to `./custom-log-location`.

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
