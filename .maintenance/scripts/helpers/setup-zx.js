import os from 'node:os';
import { $, usePowerShell } from 'zx';

let initialized = false;

export function setupZx() {
  if (initialized) {
    return;
  }

  if (os.platform() === 'win32') {
    usePowerShell();
  }

  $.verbose = true;

  initialized = true;
}
