import type { AuthProvider } from '@interopio/manager-admin-ui';

export class MyAuthProvider implements AuthProvider {
  public isLoading = false;
  public isAuthenticated = false;
  public addTokenToRequest = true;
  public addCredentialsToRequest = false;
  public addUsernameToRequest = false;
  public error: any = undefined;
  public token: string = '';

  /**
   * Set to `true` as fields are only updated during the execution of the methods defined in `AuthProvider`.
   */
  public disablePeriodicChangeDetection: boolean = true;

  public async loginIfNeeded(): Promise<void> {
    // get token query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      this.token = token;
      this.isAuthenticated = true;
      return Promise.resolve();
    }

    if (!this.isAuthenticated) {
      document.location.href = `http://localhost:3010/?callback=${document.location.href}`;
    }

    return Promise.resolve();
  }

  public async getAccessToken(): Promise<string | undefined> {
    return this.token;
  }

  public async getUserInfo(): Promise<{ id?: string | undefined } | undefined> {
    return {
      id: this.token.substring('user:'.length),
    };
  }

  public async logOut(): Promise<void> {
    this.token = '';
  }
}
