/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Profile } from 'passport';

import { ApiError } from '@App/utils';

import { ProviderType } from '@user/models';
import authService from '@user/services/auth.service';
import userService from '@user/services/user.service';
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
        ApiError.badRequest(messages.ERR_THIRD_PARTY_AUTH_MISSING_DETAILS),
      );

    const { isAdmin, user, identityExists } =
      await userService.getUserForSocialAuthentication(
        identityId,
        provider,
        email,
      );

    if (isAdmin)
      return done(ApiError.unauthorized(messages.ERR_THIRD_PARTY_AUTH_ADMIN));

    if (!isAdmin && !user && identityExists)
      return done(
        ApiError.unauthorized(messages.ERR_THIRD_PARTY_AUTH_MISMATCH),
      );

    if (user?.status === 'deactivated')
      return done(ApiError.unauthorized(messages.ERR_DEACTIVATED_ACCOUNT));

    if (user?.status === 'suspended')
      return done(ApiError.unauthorized(messages.ERR_SUSPENDED_ACCOUNT));

    if (user && identityExists) return done(null, user);

    const { customerId } = user
      ? await authService.createIdentityForCustomer(
          identityId,
          user.userId,
          user.status,
          provider,
        )
      : await authService.createCustomerAndIdentity(
          identityId,
          firstName,
          lastName,
          email,
          provider,
        );

    const u = await userService.getUserData(customerId, false);
    return done(null, u);
  } catch (err) {
    return done(err, undefined);
  }
};

export default verifyFunction;
