import net from 'node:net';

// Resolves true if a TCP connection to host:port succeeds within `timeoutMs`,
// false otherwise. Used to tell whether a database is already listening.
export function isPortOpen(host, port, timeoutMs = 1000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    function done(result) {
      socket.destroy();
      resolve(result);
    }

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));
    socket.connect(port, host);
  });
}

// Polls host:port once a second until it accepts a connection or `timeoutMs`
// elapses. Resolves true once the port is open, false on timeout.
export async function waitForPort(host, port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (await isPortOpen(host, port)) {
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return false;
}
