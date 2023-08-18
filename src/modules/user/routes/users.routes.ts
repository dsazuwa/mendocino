import { Router } from 'express';

import { trimRequestBody, validate } from '@App/middleware';

import {
  changePassword,
  closeAccount,
  createPassword,
  getProfile,
  getUserData,
  resendVerifyEmail,
  revokeSocialAuthentication,
  updateUserName,
  verifyEmail,
} from '@user/controllers/users.controller';
import { authenticate, authorize } from '@user/middleware/auth';
import { permitPending } from '@user/middleware/route-guards';
import {
  changePasswordSchema,
  createPasswordSchema,
  revokeSocialAuthenticationSchema,
  updateUserNameSchema,
  verifyEmailSchema,
} from '@user/middleware/validators/users.validator';
import { ROLES } from '@user/utils/constants';

const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get('', getUserData);

usersRouter.use(authorize([ROLES.CUSTOMER.name]));

usersRouter.get('/profile', getProfile);

usersRouter.post('/verify', permitPending, resendVerifyEmail);
usersRouter.patch(
  '/verify/:otp',
  validate(verifyEmailSchema),
  permitPending,
  verifyEmail,
);

usersRouter.patch(
  '/name',
  trimRequestBody,
  validate(updateUserNameSchema),
  updateUserName,
);

usersRouter.post('/password', validate(createPasswordSchema), createPassword);
usersRouter.patch('/password', validate(changePasswordSchema), changePassword);

usersRouter.patch(
  '/revoke-social-auth',
  validate(revokeSocialAuthenticationSchema),
  revokeSocialAuthentication,
);

usersRouter.patch('/close', closeAccount);

export default usersRouter;
