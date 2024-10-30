const glue42gd = (window as any).glue42gd;

async function login() {
  const emailElement = document.getElementById(`email`) as HTMLInputElement;
  const isEmailValid = emailElement.reportValidity();

  if (!isEmailValid) {
    // show validation error
    return;
  }

  const email = emailElement.value;

  localStorage.setItem(`user`, email);

  const token = `user:${email}`;

  // if running in interop.io desktop, try to set the token and close the window
  if (typeof glue42gd !== 'undefined') {
    await glue42gd.authDone({
      token,
      user: email,
    });

    window.close();
  }

  // if being used as protection of admin-ui we will redirect to the admin-ui with the token
  const urlParams = new URLSearchParams(window.location.search);

  const callbackParam = urlParams.get(`callback`);

  if (callbackParam) {
    window.location.href = callbackParam + '?token=' + token;
  }
}

function closeWindow() {
  window.close();
}

window.addEventListener('DOMContentLoaded', () => {
  const emailElement = document.getElementById(`email`) as HTMLInputElement;

  const user = localStorage.getItem(`user`);
  if (user) {
    emailElement.value = user;
  }

  const loginButton = document.getElementById(
    'login-button'
  ) as HTMLButtonElement;

  loginButton.addEventListener('click', login);

  const closeWindowButton = document.getElementById(
    'close-button'
  ) as HTMLButtonElement;

  closeWindowButton.addEventListener('click', closeWindow);
});
