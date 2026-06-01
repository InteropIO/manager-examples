import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

import { program } from 'commander';
import { $ } from 'zx';

import { EnvironmentVariables } from './helpers/env/environment-variables.js';
import { fileExists } from './helpers/file-exists.js';
import { findNpmPackages } from './helpers/find-npm-packages.js';
import { init } from './helpers/init.js';
import { packageScope } from './helpers/variables.js';
import { waitForPort, isPortOpen } from './helpers/wait-for-port.js';
import { withInjectedLicense } from './helpers/with-injected-license.js';

// Default listening port per store type. The dev databases in the io.Manager
// monorepo (npm run start:db-dev) bind these, and the example connection
// strings target them, so a type -> port map is enough to pick the right
// pre-flight check.
const STORE_PORTS = {
  mongo: 27017,
  postgresql: 5432,
  mssql: 1433,
};

const DB_HOST = 'localhost';
const DB_READY_TIMEOUT_MS = 120000;

await init();

program
  .name('start-example')
  .description(
    'Build and start every package of an io.Manager example for an interactive run: ' +
      'injects your real license key into the built server, brings up the dev databases ' +
      'if they are not already running, and starts the server alongside any admin UI / ' +
      'io.CD login pages.'
  )
  .argument(
    '<example>',
    'Example folder name to start, e.g. "auth-custom", "db-postgresql".'
  )
  .option('--no-db', 'Skip the database pre-flight check and auto-start.');

const systemArgs = process.argv.slice(0, 2);
const applicationArgs = process.argv.slice(2);

while (applicationArgs[0] === '--') {
  applicationArgs.shift();
}

program.parse([...systemArgs, ...applicationArgs]);

const exampleName = program.args[0];
const options = program.opts();

const packages = await findNpmPackages(exampleName);

if (packages.length === 0) {
  throw new Error(
    `No npm packages found for example "${exampleName}". Pass an example folder name, e.g. "auth-none".`
  );
}

function isServerPackage(packageObject) {
  const dependencies = packageObject.packageJson.dependencies || {};

  return Object.keys(dependencies).includes(`${packageScope}/manager`);
}

const serverPackages = packages.filter(isServerPackage);

const otherPackages = packages.filter(
  (packageObject) =>
    !isServerPackage(packageObject) && packageObject.packageJson.scripts?.start
);

if (serverPackages.length === 0 && otherPackages.length === 0) {
  throw new Error(
    `Example "${exampleName}" has no startable packages (no "@interopio/manager" server and no package with a "start" script).`
  );
}

async function detectStorePort(serverPackagePath) {
  const envPath = path.join(serverPackagePath, '.env');

  if (await fileExists(envPath)) {
    const envContents = await fs.readFile(envPath, 'utf8');

    const match = envContents.match(/^\s*API_STORE_TYPE\s*=\s*(\S+)/m);

    if (match && STORE_PORTS[match[1]]) {
      return STORE_PORTS[match[1]];
    }
  }

  const indexPath = path.join(serverPackagePath, 'src', 'index.ts');

  if (await fileExists(indexPath)) {
    const indexContents = await fs.readFile(indexPath, 'utf8');

    const match = indexContents.match(
      /store:\s*{[\s\S]*?type:\s*['"](\w+)['"]/
    );

    if (match && STORE_PORTS[match[1]]) {
      return STORE_PORTS[match[1]];
    }
  }

  return STORE_PORTS.mongo;
}

async function readFileSafe(filePath) {
  if (await fileExists(filePath)) {
    return fs.readFile(filePath, 'utf8');
  }

  return undefined;
}

function matchFirst(text, regex, fallback) {
  const match = text?.match(regex);

  return match ? match[1] : fallback;
}

// Server packages expose their REST API at `<port>/<base>` and Swagger UI at
// `<port>/<base>/<swaggerUIRoute>`. The values come from the hardcoded config in
// `src/index.ts` or, for the env-var-configured example, from `.env` — falling
// back to the io.Manager defaults (4356 / api / swagger) when neither names one.
async function resolveServerUrls(packagePath) {
  let port = '4356';
  let base = 'api';
  let swaggerRoute = 'swagger';

  const envContents = await readFileSafe(path.join(packagePath, '.env'));

  if (envContents) {
    port = matchFirst(envContents, /^\s*API_PORT\s*=\s*(\S+)/m, port);
    base = matchFirst(envContents, /^\s*API_BASE\s*=\s*(\S+)/m, base);
    swaggerRoute = matchFirst(
      envContents,
      /^\s*API_OPEN_API_SWAGGER_UI_ROUTE\s*=\s*(\S+)/m,
      swaggerRoute
    );
  }

  const indexContents = await readFileSafe(
    path.join(packagePath, 'src', 'index.ts')
  );

  if (indexContents) {
    port = matchFirst(indexContents, /port:\s*(\d+)/, port);
    base = matchFirst(indexContents, /base:\s*['"]([^'"]+)['"]/, base);
    swaggerRoute = matchFirst(
      indexContents,
      /swaggerUIRoute:\s*['"]([^'"]+)['"]/,
      swaggerRoute
    );
  }

  const baseUrl = base
    ? `http://localhost:${port}/${base}`
    : `http://localhost:${port}`;

  return [
    { label: 'Server API', url: baseUrl },
    { label: 'Swagger UI', url: `${baseUrl}/${swaggerRoute}` },
  ];
}

// Vite packages serve on the port in their `vite.config.ts` (3000 for the admin
// UI, 3010 for the io.CD login page). The admin UI is mounted under its
// `baseName` prop; the io.CD login page lives at the root.
async function resolveOtherUrl(packageObject) {
  const { packagePath, packageJson } = packageObject;

  const viteContents = await readFileSafe(
    path.join(packagePath, 'vite.config.ts')
  );

  const port = matchFirst(viteContents, /port:\s*(\d+)/, '3000');

  const dependencies = Object.keys(packageJson.dependencies || {});

  if (dependencies.includes(`${packageScope}/manager-admin-ui`)) {
    const mainContents = await readFileSafe(
      path.join(packagePath, 'src', 'main.tsx')
    );

    const baseName = matchFirst(
      mainContents,
      /baseName=["']([^"']+)["']/,
      'admin'
    );

    return { label: 'Admin UI', url: `http://localhost:${port}/${baseName}` };
  }

  return { label: 'io.CD login', url: `http://localhost:${port}/` };
}

function printUrls(urls, ready) {
  const labelWidth = Math.max(...urls.map((entry) => entry.label.length));

  console.log('');
  console.log(
    ready
      ? `Example "${exampleName}" is ready:`
      : `Starting example "${exampleName}" (URLs become available once each service finishes starting):`
  );

  for (const { label, url } of urls) {
    console.log(`  ${label.padEnd(labelWidth)}   ${url}`);
  }

  console.log('');
}

// Once every URL's port is accepting connections, re-print the list so the user
// has a clean, clickable summary after the noisy build / vite output.
async function announceWhenReady(urls) {
  const ports = [
    ...new Set(urls.map((entry) => Number(new URL(entry.url).port))),
  ];

  const deadline = Date.now() + DB_READY_TIMEOUT_MS;

  while (Date.now() < deadline && !shuttingDown) {
    const open = await Promise.all(
      ports.map((port) => isPortOpen(DB_HOST, port))
    );

    if (open.every(Boolean)) {
      printUrls(urls, true);

      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
}

async function ensureDatabase() {
  if (options.db === false || serverPackages.length === 0) {
    return;
  }

  const dbPort = await detectStorePort(serverPackages[0].packagePath);

  if (await isPortOpen(DB_HOST, dbPort)) {
    console.log(`Database already reachable at ${DB_HOST}:${dbPort}.`);

    return;
  }

  const managerDir = EnvironmentVariables.IO_MANAGER_DIR;

  console.log(
    `Database not reachable at ${DB_HOST}:${dbPort}. Starting the dev databases in "${managerDir}"...`
  );

  await $({ cwd: managerDir })`npm run start:db-dev`;

  console.log(`Waiting for the database on ${DB_HOST}:${dbPort}...`);

  const ready = await waitForPort(DB_HOST, dbPort, DB_READY_TIMEOUT_MS);

  if (!ready) {
    throw new Error(
      `The database on ${DB_HOST}:${dbPort} did not become reachable within ${
        DB_READY_TIMEOUT_MS / 1000
      }s.`
    );
  }
}

const children = [];

let shuttingDown = false;

// Kills the whole process tree rooted at a spawned command. zx's child.kill()
// only signals the immediate child (the npm / shell wrapper), so the real
// node / vite grandchildren would survive — on Windows we use `taskkill /T` to
// terminate the tree, elsewhere a negative-pid group signal.
async function killTree(child) {
  const pid = child.child?.pid;

  if (!pid) {
    return;
  }

  try {
    if (os.platform() === 'win32') {
      await $`taskkill /pid ${pid} /T /F`.nothrow();
    } else {
      await child.kill('SIGTERM');
    }
  } catch {
    // ignore
  }
}

async function shutdown(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  console.log(`\nReceived "${signal}". Stopping the example...`);

  // Killing the children rejects the awaited `$` promises below, which lets the
  // withInjectedLicense `finally` restore the patched files before the script
  // unwinds and exits on its own. We deliberately do NOT process.exit() here.
  await Promise.all(children.map(killTree));
}

for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK']) {
  process.on(signal, () => {
    shutdown(signal).then(() => {
      // Backstop: if a killed child somehow fails to unblock the event loop,
      // force-exit after a grace period. Unref'd so it never delays a clean exit.
      setTimeout(() => process.exit(0), 3000).unref();
    });
  });
}

async function startServer(packageObject) {
  const { packagePath, packageJson } = packageObject;

  console.log(`Building server "${packageJson.name}"...`);

  await $({ cwd: packagePath })`npm run build`;

  console.log(`Starting server "${packageJson.name}"...`);

  await withInjectedLicense(packagePath, async () => {
    const child = $({ cwd: packagePath })`node dist/index.js`;

    children.push(child);

    await child;
  });
}

async function startOther(packageObject) {
  const { packagePath, packageJson } = packageObject;

  console.log(`Starting "${packageJson.name}"...`);

  const child = $({ cwd: packagePath })`npm run start`;

  children.push(child);

  await child;
}

await ensureDatabase();

const urls = [];

for (const serverPackage of serverPackages) {
  urls.push(...(await resolveServerUrls(serverPackage.packagePath)));
}

for (const otherPackage of otherPackages) {
  urls.push(await resolveOtherUrl(otherPackage));
}

printUrls(urls, false);

const runners = [
  ...serverPackages.map(startServer),
  ...otherPackages.map(startOther),
  announceWhenReady(urls),
];

try {
  await Promise.all(runners);
} catch (error) {
  if (!shuttingDown) {
    throw error;
  }
}
