import { setupZx } from './setup-zx.js';
import { readDotEnvFiles } from './env/dot-env.js';

export async function init() {
  setupZx();
  readDotEnvFiles();
}
