/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Profile } from 'passport';

import { ApiError } from '@App/utils';

import { ProviderType } from '@user/models';
import authService from '@user/services/auth.service';
import messages from '@user/utils/messages';

const verifyFunction = async (
  profile: Profile,
  done: (error: any, user?: Express.User, info?: any) => void,
  provider: ProviderType,
) => {
  try {
    const { id: identityId, emails, name } = profile;

    const email = emails?.at(0)?.value;
    const firstName = name?.givenName;
    const lastName = name?.familyName;

    if (!(email && firstName && lastName))
      return done(
        ApiError.badRequest('Social authentication details missing'),
        undefined,
      );

    const { user, userExists, identityExists } =
      await authService.getUserForSocialAuthentication(
        identityId,
        provider,
        email,
      );

    if (identityExists) return done(null, user);

    if (userExists && user?.status === 'inactive')
      return done(
        ApiError.unauthorized(messages.ERR_DEACTIVATED_ACCOUNT),
        undefined,
      );

    const newIdentity = await (userExists
      ? authService.createUserIdentityForUser(
          identityId,
          user?.userId as number,
          user?.status as string,
          provider,
        )
      : authService.createUserAndUserIdentity(
          identityId,
          firstName,
          lastName,
          email,
          provider,
        ));

    const u = await authService.getUserData(newIdentity.userId, provider);
    return done(null, u);
  } catch (err) {
    return done(err, undefined);
  }
};

export default verifyFunction;
