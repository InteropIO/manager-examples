import type { Request, Response } from 'express';
import type { CustomAuthenticator } from '@interopio/manager';
import type { User, Token } from '@interopio/manager-api';

import { users } from './data';

// Custom authenticator that validates a token and returns the user info
export class MyAuthenticator implements CustomAuthenticator {
  initialize(): void {
    // initialization point
  }

  authenticate(
    req: Request,
    res: Response,
    next: (err?: Error, info?: User) => void,
    token?: Token
  ): void {
    // extract the token from the request
    const tokenFromRequest = this.extractToken(req);

    if (!tokenFromRequest) {
      next(new UnauthorizedError('can not find token'));
      return;
    }

    const userEmail = tokenFromRequest?.replace(`user:`, ``);

    // validate the token
    if (!this.validateToken(tokenFromRequest)) {
      next(new UnauthorizedError(`invalid token`));
      return;
    }

    // in this dummy example the token is actually the username, so we to try to find the user based on it
    const user = users.find((u) => u.email === userEmail);
    if (!user) {
      next(new UnauthorizedError(`unknown user`));
      return;
    }

    // return the user info
    next(undefined, user);
  }

  private extractToken(req: Request): string | undefined {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      return req.headers.authorization.split(' ')[1];
    }
    return undefined;
  }

  private validateToken(token: string) {
    return true;
  }
}

class UnauthorizedError extends Error {
  statusCode: number = 401;
}
