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
} from '@user/controllers/customer.controller';
import { authenticate, authorize } from '@user/middleware/auth';
import { permitPending } from '@user/middleware/route-guards';
import {
  changePasswordSchema,
  createPasswordSchema,
  revokeSocialAuthenticationSchema,
  updateUserNameSchema,
  verifyEmailSchema,
} from '@user/middleware/validators/users.validator';

const customerRouter = Router();

customerRouter.use(authenticate);

customerRouter.get('', getUserData);

customerRouter.use(authorize(['customer']));

customerRouter.get('/profile', getProfile);

customerRouter.post('/verify', permitPending, resendVerifyEmail);
customerRouter.patch(
  '/verify/:otp',
  validate(verifyEmailSchema),
  permitPending,
  verifyEmail,
);

customerRouter.patch(
  '/name',
  trimRequestBody,
  validate(updateUserNameSchema),
  updateUserName,
);

customerRouter.post(
  '/password',
  validate(createPasswordSchema),
  createPassword,
);
customerRouter.patch(
  '/password',
  validate(changePasswordSchema),
  changePassword,
);

customerRouter.patch(
  '/revoke-social-auth',
  validate(revokeSocialAuthenticationSchema),
  revokeSocialAuthentication,
);

customerRouter.patch('/close', closeAccount);

export default customerRouter;
