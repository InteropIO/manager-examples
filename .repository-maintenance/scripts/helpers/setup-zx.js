import { $, usePowerShell } from 'zx';

export function setupZx() {
  usePowerShell();
  $.verbose = true;
}
