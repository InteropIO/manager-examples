# Admin UI Bundler Examples

This folder contains a set of minimal, standalone examples that show how to bundle the **io.Manager Admin UI** (`@interopio/manager-admin-ui`) as a pure React single-page application using different JavaScript bundlers.

Each example is intentionally narrow in scope:

- It is a **bundler-only demo** — there is no `io-manager-server` and no `io-cd-login` page.
- It mounts a single `<AdminUI />` component into a React root.
- It points at an external io.Manager server at `http://localhost:4356/api` — you are expected to run your own io.Manager server (any of the sibling examples will do) or change the `apiURL` prop to point at one.

The Admin UI renders on `http://localhost:3000/admin` (the default `baseName` is `admin`) when run with the development server included in each example.

## Examples

- [webpack](./webpack) - Bundling the Admin UI with **Webpack 5** and `webpack-dev-server`.
- [rspack](./rspack) - Bundling the Admin UI with **Rspack** (a fast, Rust-based Webpack-compatible bundler).
- [esbuild](./esbuild) - Bundling the Admin UI with **esbuild** using its JavaScript API and built-in `serve`.
- [parcel](./parcel) - Bundling the Admin UI with **Parcel** (zero-config).
- [rollup](./rollup) - Bundling the Admin UI with **Rollup** and a small plugin set.
- [vite](./vite) - Bundling the Admin UI with **Vite** and `@vitejs/plugin-react`.

## Prerequisites

### io.Manager server

These examples only bundle the Admin UI. You need an io.Manager server running at `http://localhost:4356/api` for the Admin UI to talk to. The simplest way to get one is to run one of the sibling examples in this repository (for example, [auth-none](../auth-none)).

If your server is reachable at a different URL, change the `apiURL` prop in `src/index.tsx`.
