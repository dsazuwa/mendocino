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

    let user = await authService.getUserDataFromIdentity(identityId, provider);

    if (user) return done(null, user);

    const account = await authService.getAccount(email);

    if (account?.status === 'inactive')
      return done(
        ApiError.unauthorized(messages.ERR_DEACTIVATED_ACCOUNT),
        undefined,
      );

    const newIdentity = await authService.createNewIdentity(
      identityId,
      account,
      firstName,
      lastName,
      email,
      provider,
    );

    user = await authService.getUserData(newIdentity.userId, provider);

    return done(null, user);
  } catch (err) {
    return done(err, undefined);
  }
};

export default verifyFunction;
