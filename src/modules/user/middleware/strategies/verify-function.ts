/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Profile } from 'passport';

import { ApiError } from '@App/utils';

import { ProviderType } from '@user/models';
import authService from '@user/services/auth.service';
import messages from '@user/utils/messages';

const verifyFunction = async (
  profile: Profile,
  done: (error: any, user?: Express.User, info?: any) => void,
  providerType: ProviderType,
) => {
  try {
    const { id, emails, name } = profile;

    const email = emails?.at(0)?.value;
    const firstName = name?.givenName;
    const lastName = name?.familyName;

    if (!(email && firstName && lastName))
      return done(
        ApiError.badRequest('Social authentication details missing'),
        undefined,
      );

    let user = await authService.getUserDataFromIdentity(id, providerType);

    if (user) return done(null, user);

    const account = await authService.getAccount(email);

    if (account?.status === 'inactive')
      return done(
        ApiError.unauthorized(messages.ERR_DEACTIVATED_ACCOUNT),
        undefined,
      );

    const newIdentity = await authService.createNewIdentity(
      id,
      account,
      firstName,
      lastName,
      email,
      providerType,
    );

    user = await authService.getUserData(newIdentity.userId, providerType);

    return done(null, user);
  } catch (err) {
    return done(err, undefined);
  }
};

export default verifyFunction;
