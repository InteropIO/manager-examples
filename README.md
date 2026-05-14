# Introduction

This repository contains various examples on how to setup **io.Manager**

# Database

- [db-mongo](./db-mongo) - An example that demonstrates how to setup a **io.Manager** instance to use MongoDB
- [db-postgresql](./db-postgresql) - An example that demonstrates how to setup a **io.Manager** instance to use PostgreSQL
- [db-mssql](./db-mssql) - An example that demonstrates how to setup a **io.Manager** instance to use MSSQL (SQL Server)

# Authentication

- [auth-none](./auth-none) - An example that demonstrates how to setup a **io.Manager** instance to use None authentication
- [auth-basic](./auth-basic) - An example that demonstrates how to setup a **io.Manager** instance to use Basic authentication
- [auth-auth0](./auth-auth0) - An example that demonstrates how to setup a **io.Manager** instance to use Auth0 authentication
- [auth-okta](./auth-okta) - An example that demonstrates how to setup a **io.Manager** instance to use Okta authentication
- [auth-custom](./auth-custom) - A custom **io.Manager** authentication example
- [auth-custom-advanced](./auth-custom-advanced) - An advanced custom **io.Manager** authentication example

# OpenTelemetry

- [otel-basic](./otel-basic) - Basic example that shows how to use OpenTelemetry with **io.Manager**
- [otel-custom-logs-exporter](./otel-custom-logs-exporter) - An example showing how to configure **io.Manager** to use a custom OpenTelemetry logs exporter
- [otel-custom-logs-processor](./otel-custom-logs-processor) - An example showing how to configure **io.Manager** to use a custom OpenTelemetry logs processor
- [otel-custom-metrics-exporter](./otel-custom-metrics-exporter) - An example showing how to configure **io.Manager** to use a custom OpenTelemetry metrics exporter
- [otel-custom-metrics-reader](./otel-custom-metrics-reader) - An example showing how to configure **io.Manager** to use a custom OpenTelemetry metrics reader
- [otel-custom-trace-exporter](./otel-custom-trace-exporter) - An example showing how to configure **io.Manager** to use a custom OpenTelemetry trace exporter
- [otel-custom-trace-processor](./otel-custom-trace-processor) - An example showing how to configure **io.Manager** to use a custom OpenTelemetry trace processor
- [otel-custom-trace-sampler](./otel-custom-trace-sampler) - An example showing how to configure **io.Manager** to use a custom OpenTelemetry trace sampler
- [otel-sentry](./otel-sentry) - An example that shows how to setup **io.Manager** to send OpenTelemetry traces to Sentry.

# Admin UI Bundlers

A set of examples that show how to bundle the **io.Manager Admin UI** (`@interopio/manager-admin-ui`) as a standalone React single-page application using different bundlers. Each example is bundler-only — no server, no auth, no io.Connect Desktop sign-in page — and expects an existing io.Manager server to talk to. See [admin-ui-bundler-examples](./admin-ui-bundler-examples) for the shared README.

- [admin-ui-bundler-examples/webpack](./admin-ui-bundler-examples/webpack) - Bundling the Admin UI with **Webpack 5** and `webpack-dev-server`.
- [admin-ui-bundler-examples/rspack](./admin-ui-bundler-examples/rspack) - Bundling the Admin UI with **Rspack**.
- [admin-ui-bundler-examples/esbuild](./admin-ui-bundler-examples/esbuild) - Bundling the Admin UI with **esbuild** through its JavaScript API.
- [admin-ui-bundler-examples/parcel](./admin-ui-bundler-examples/parcel) - Bundling the Admin UI with **Parcel** (zero-config).
- [admin-ui-bundler-examples/rollup](./admin-ui-bundler-examples/rollup) - Bundling the Admin UI with **Rollup** and a small plugin set.
- [admin-ui-bundler-examples/vite](./admin-ui-bundler-examples/vite) - Bundling the Admin UI with **Vite** and `@vitejs/plugin-react`.

# Other

- [custom-endpoints](./custom-endpoints) - An example that demonstrates how to implement custom endpoints to **io.Manager**.
- [node-esm](./node-esm) - An example that demonstrates how to setup a **io.Manager** in a Node.js native ESM project.
- [custom-logging-config](./custom-logging-config) - An example that demonstrates how to pass custom logging configuration to **io.Manager**.
- [environment-variable-configuration](./environment-variable-configuration) - An example that demonstrates how to configure an **io.Manager** instance using environment variables.
- [docker-images](./docker-images) - An example that demonstrates how to use the **io.Manager** Docker images to create an instance of **io.Manager**.
- [manager-template](./manager-template) - A template for building and deploying **io.Manager** to your own infrastructure.
