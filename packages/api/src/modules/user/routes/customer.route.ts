import { Router } from 'express';

import { trimRequestBody, validate } from '../../../middleware';
import {
  changePassword,
  closeAccount,
  createPassword,
  getProfile,
  resendVerifyEmail,
  revokeSocialAuthentication,
  updateProfile,
  verifyEmail,
} from '../controllers/customer.controller';
import { authenticate, authorize } from '../middleware/auth';
import { permitPending } from '../middleware/route-guards';
import {
  changePasswordSchema,
  createPasswordSchema,
  revokeSocialAuthenticationSchema,
  updateCustomerProfile,
  verifyEmailSchema,
} from '../middleware/validators/users.validator';

const customerRouter = Router();

customerRouter.use(authenticate, authorize(['customer']));

customerRouter.get('/profile', getProfile);
customerRouter.patch(
  '/profile',
  validate(updateCustomerProfile),
  updateProfile,
);

customerRouter.post('/verify', permitPending, resendVerifyEmail);
customerRouter.patch(
  '/verify/:otp',
  validate(verifyEmailSchema),
  permitPending,
  verifyEmail,
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
