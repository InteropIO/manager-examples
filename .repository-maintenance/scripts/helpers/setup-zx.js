import os from 'node:os';
import { $, usePowerShell } from 'zx';

export function setupZx() {
  if (os.platform() === 'win32') {
    usePowerShell();
  }

  $.verbose = true;
}