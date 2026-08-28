# io.Manager Admin UI - Vite Example

This example demonstrates how to bundle the **io.Manager Admin UI** (`@interopio/manager-admin-ui`) as a standalone React single-page application using **Vite** and the `@vitejs/plugin-react` plugin.

It is a bundler-only example - there is no io.Manager server in this folder. You need to run an io.Manager server separately at `http://localhost:4356/api` (or change the `apiURL` prop in [`src/index.tsx`](./src/index.tsx) to point at your own server).

## Prerequisites

- Node.js 18+
- A running io.Manager server reachable at `http://localhost:4356/api`. See the sibling [auth-none](../../auth-none) example for the easiest way to get one.

# How to run

- Install dependencies:

```sh

npm install

npm audit fix

```

- Start the development server:

```sh

npm run start

```

- The Admin UI can be found at http://localhost:3000/admin

- To produce a production build:

```sh

npm run build

```

The bundled output is written to `./dist`.
