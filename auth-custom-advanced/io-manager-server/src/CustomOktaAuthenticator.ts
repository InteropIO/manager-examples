import type { Request, Response } from 'express';

import * as OktaJwtVerifier from '@okta/jwt-verifier';

import {
  type CustomAuthenticator,
  type User,
  CustomAuthUnauthorizedError,
} from '@interopio/manager';

export class CustomOktaAuthenticator implements CustomAuthenticator {
  private oktaVerifier!: OktaJwtVerifier;
  private audiences!: string[];

  initialize() {
    // TODO: Specify the appropriate okta verifier options here.
    this.oktaVerifier = new OktaJwtVerifier({
      issuer: 'https://dev-10894256.okta.com/oauth2/default',
    });

    // TODO: Specify the appropriate audiences here.
    this.audiences = ['api://default'];
  }

  authenticate(
    req: Request,
    res: Response,
    next: (err?: Error, info?: User) => void
  ) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      next(
        new CustomAuthUnauthorizedError(
          'Missing or empty "Authorization" header.'
        )
      );
      return;
    }

    const parts = authorizationHeader.split(' ');
    const tokenType = parts[0];
    const tokenValue = parts[1];

    if (tokenType !== 'Bearer') {
      next(
        new CustomAuthUnauthorizedError(
          `Expected a "Bearer" token, found "${tokenType}".`
        )
      );
      return;
    }

    this.oktaVerifier
      .verifyAccessToken(tokenValue, this.audiences)
      .then((jwt) => {
        const user: User = {
          id: jwt.claims.sub,
          apps: [],

          // TODO: Specify the io.Manager groups for the user.
          //
          // The `GLUE42_SERVER_ADMIN` group below grants admin access
          // (needed for the Admin UI) and is for demonstration purposes only,
          // it should not be granted to all users.
          groups: ['GLUE42_SERVER_ADMIN'],
        };

        next(undefined, user);
      })
      .catch((error) => {
        console.error(error);
        next(new CustomAuthUnauthorizedError('Failed to verify access token.'));
      });
  }
}
