import { Router } from 'express';

import { trimRequestBody, validate } from '../../../middleware';
import {
  changePassword,
  closeAccount,
  createPassword,
  getProfile,
  resendVerifyEmail,
  revokeSocialAuthentication,
  updateUserName,
  verifyEmail,
} from '../controllers/customer.controller';
import { authenticate, authorize } from '../middleware/auth';
import { permitPending } from '../middleware/route-guards';
import {
  changePasswordSchema,
  createPasswordSchema,
  revokeSocialAuthenticationSchema,
  updateUserNameSchema,
  verifyEmailSchema,
} from '../middleware/validators/users.validator';

const customerRouter = Router();

customerRouter.use(authenticate, authorize(['customer']));

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
  trimRequestBody,
  validate(createPasswordSchema),
  createPassword,
);
customerRouter.patch(
  '/password',
  trimRequestBody,
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
