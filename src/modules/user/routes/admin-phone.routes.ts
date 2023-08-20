import { Router } from 'express';

import { trimRequestBody, validate } from '@App/middleware';

import {
  deletePhone,
  registerPhone,
  resendVerifySMS,
  verifyPhone,
} from '@App/modules/user/controllers/admin-phone.controller';
import { authenticate } from '@user/middleware/auth';
import {
  registerPhoneSchema,
  verifyPhoneSchema,
} from '@user/middleware/validators/phones.validator';

const adminPhoneRouter = Router();

adminPhoneRouter.use(authenticate);

adminPhoneRouter.post(
  '',
  trimRequestBody,
  validate(registerPhoneSchema),
  registerPhone,
);
adminPhoneRouter.patch('/resend', resendVerifySMS);
adminPhoneRouter.patch('/:otp', validate(verifyPhoneSchema), verifyPhone);
adminPhoneRouter.delete('', deletePhone);

export default adminPhoneRouter;
