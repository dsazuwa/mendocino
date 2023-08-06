import { Request } from 'express';
import { PassportStatic } from 'passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

import { ApiError } from '@App/utils';

import authService from '@user/services/auth.service';
import messages from '@user/utils/messages';

export const googleVerifyFunction = async (
  req: Request,
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback,
) => {
  try {
    const { id, emails, name } = profile;

    const identity = await authService.getIdentity(id, 'google');

    if (!identity) {
      const email = emails?.at(0)?.value ?? '';

      const account = await authService.getAccount(email);

      if (account?.status === 'inactive') {
        done(
          ApiError.unauthorized(messages.ERR_DEACTIVATED_ACCOUNT),
          undefined,
        );
      } else {
        const newIdentity = await authService.createNewIdentity(
          id,
          account,
          name?.givenName ?? '',
          name?.familyName ?? '',
          email,
          'google',
        );

        done(null, { status: 'active', ...newIdentity.dataValues });
      }
    } else {
      done(null, { status: 'active', ...identity.dataValues });
    }
  } catch (err) {
    done(err as string | Error, undefined);
  }
};

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
      googleVerifyFunction,
    ),
  );
};
