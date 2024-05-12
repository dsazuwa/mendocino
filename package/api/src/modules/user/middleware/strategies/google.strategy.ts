import { PassportStatic } from 'passport';
import { Strategy } from 'passport-google-oauth20';

import verifyFunction from './verify-function';

export const configureGoogleStrategy = (passportStatic: PassportStatic) => {
  const { GOOGLE_AUTH_CLIENT_ID, GOOGLE_AUTH_CLIENT_SECRET } = process.env;

  passportStatic.use(
    new Strategy(
      {
        callbackURL: '/api/auth/google/callback',
        clientID: GOOGLE_AUTH_CLIENT_ID,
        clientSecret: GOOGLE_AUTH_CLIENT_SECRET,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        await verifyFunction(profile, done, 'google');
      },
    ),
  );
};
