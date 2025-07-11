import type IODesktop from '@interopio/desktop';

declare global {
  interface Window {
    IODesktop: typeof IODesktop;
  }
}

export async function getWindowFromSDK() {
  if (!window.IODesktop) {
    window.IODesktop = (await import('@interopio/desktop')).default;
  }

  const io = await window.IODesktop();
  return io.windows.my()!;
}
