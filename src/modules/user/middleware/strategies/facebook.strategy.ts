import { PassportStatic } from 'passport';
import { Strategy } from 'passport-facebook';

import verifyFunction from './verify-function';

export const configureFacebookStrategy = (passportStatic: PassportStatic) => {
  const { FACEBOOK_AUTH_CLIENT_ID, FACEBOOK_AUTH_CLIENT_SECRET } = process.env;

  passportStatic.use(
    new Strategy(
      {
        callbackURL: '/api/auth/facebook/callback',
        clientID: FACEBOOK_AUTH_CLIENT_ID,
        clientSecret: FACEBOOK_AUTH_CLIENT_SECRET,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        await verifyFunction(profile, done, 'facebook');
      },
    ),
  );
};
