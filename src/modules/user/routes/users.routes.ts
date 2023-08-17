import { Router } from 'express';

import { trimRequestBody, validate } from '@App/middleware';

import {
  changePassword,
  closeAccount,
  createPassword,
  getProfile,
  getUserData,
  greet,
  resendVerifyEmail,
  revokeSocialAuthentication,
  updateUserName,
  verifyEmail,
} from '@user/controllers/users.controller';
import {
  authenticate,
  authenticateInactive,
  authorize,
} from '@user/middleware/auth';
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

usersRouter.get('/inactive/greeting', authenticateInactive, greet);

usersRouter.use(authenticate);

usersRouter.get('/greeting', greet);

usersRouter.get('', getUserData);

usersRouter.get('/profile', getProfile);

usersRouter.post(
  '/verify',
  authorize([ROLES.CUSTOMER.name]),
  permitPending,
  resendVerifyEmail,
);
usersRouter.patch(
  '/verify/:otp',
  authorize([ROLES.CUSTOMER.name]),
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

usersRouter.post(
  '/password',
  authorize([ROLES.CUSTOMER.name]),
  validate(createPasswordSchema),
  createPassword,
);

usersRouter.patch('/password', validate(changePasswordSchema), changePassword);

usersRouter.patch(
  '/revoke-social-auth',
  authorize([ROLES.CUSTOMER.name]),
  validate(revokeSocialAuthenticationSchema),
  revokeSocialAuthentication,
);

usersRouter.patch('/close', closeAccount);

export default usersRouter;
