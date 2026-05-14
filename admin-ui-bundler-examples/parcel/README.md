# io.Manager Admin UI - Parcel Example

This example demonstrates how to bundle the **io.Manager Admin UI** (`@interopio/manager-admin-ui`) as a standalone React single-page application using **Parcel** with its zero-configuration setup.

Parcel discovers the application by following imports from the [`index.html`](./index.html) entry point - no config file is needed.

It is a bundler-only example - there is no io.Manager server in this folder. You need to run an io.Manager server separately at `http://localhost:4356/api` (or change the `apiURL` prop in [`src/index.tsx`](./src/index.tsx) to point at your own server).

## Prerequisites

- Node.js 18+
- A running io.Manager server reachable at `http://localhost:4356/api`. See the sibling [auth-none](../../auth-none) example for the easiest way to get one.

# How to run

- Install dependencies:

```sh

npm install

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

## Note on Parcel's `packageExports` opt-in

This example relies on Parcel's `packageExports` opt-in. The opt-in is set at the monorepo root (`manager-examples/package.json`), not inside this example, because in a workspace setup Parcel only reads the root `package.json` for resolver configuration - see [parcel-bundler/parcel#9078](https://github.com/parcel-bundler/parcel/issues/9078).

## Note on the `console.error` filter

The top of [`src/index.tsx`](./src/index.tsx) installs a small `console.error` filter before any other imports. Parcel's dev server renders a full-screen `<parcel-error-overlay>` whenever React fires a `console.error` for a deprecation warning, even though the warning is harmless and the page itself works. The warnings come from vendored dependencies inside `@interopio/manager-admin-ui` (reactstrap and friends) - `defaultProps will be removed from function components`, a `non-boolean attribute` warning, and one `Failed %s type` propTypes warning. Parcel has no documented option to suppress the overlay - see [parcel-bundler/parcel#9738](https://github.com/parcel-bundler/parcel/issues/9738).

The filter drops only those three known warning patterns and lets every other `console.error` through, so real errors still surface. The other bundlers in this folder don't need this workaround - they log the same warnings quietly to the console.

## Note on the `zod` `sideEffects` patch

This example ships with a `postinstall` hook ([`scripts/patch-zod-side-effects.mjs`](./scripts/patch-zod-side-effects.mjs)) that removes the `"sideEffects": false` declaration from every `package.json` under `node_modules/zod`.

The reason: Parcel's dev packager defers a dependency when its asset is marked `sideEffects: false` and only re-exports a namespace. `zod/v4/mini/index.js` matches both conditions exactly, so the real `zod/mini` module gets replaced by an empty `{}` stub at runtime, which breaks the entire `@interopio/manager-api` Zod surface in dev mode. The production build is unaffected, because scope-hoisting takes a different path.

The patch is idempotent - re-running it on an already-patched tree is a no-op - and only touches `"sideEffects": false`; other values (arrays, `true`) are left alone. See [oven-sh/bun#27709](https://github.com/oven-sh/bun/issues/27709) for a similar class of bug caused by aggressive `sideEffects: false` declarations.
