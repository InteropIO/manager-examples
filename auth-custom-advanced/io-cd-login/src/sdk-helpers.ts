import type IODesktop from '@interopio/desktop';

declare global {
  interface Window {
    IODesktop: typeof IODesktop;
  }
}

if (!window.IODesktop) {
  window.IODesktop = (await import('@interopio/desktop')).default;
}

export async function getWindowFromSDK() {
  const io = await window.IODesktop();
  return io.windows.my()!;
}
