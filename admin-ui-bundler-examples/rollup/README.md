# io.Manager Admin UI - Rollup Example

This example demonstrates how to bundle the **io.Manager Admin UI** (`@interopio/manager-admin-ui`) as a standalone React single-page application using **Rollup** and a small plugin set:

- `@rollup/plugin-node-resolve` - resolve `node_modules` imports
- `@rollup/plugin-commonjs` - convert CommonJS modules to ES modules (required for React)
- `@rollup/plugin-typescript` - compile TypeScript / JSX
- `@rollup/plugin-replace` - inline `process.env.NODE_ENV`
- `rollup-plugin-import-css` - bundle the Admin UI's stylesheet
- `rollup-plugin-serve` + `rollup-plugin-livereload` - dev server with live reload

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

- Start the development server (Rollup watch mode + live-reload server):

```sh

npm run start

```

- The Admin UI can be found at http://localhost:3000/admin

- To produce a production build:

```sh

npm run build

```

The bundled output is written to `./dist`.
