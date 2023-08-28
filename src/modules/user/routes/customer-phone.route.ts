import { Router } from 'express';

import { trimRequestBody, validate } from '@App/middleware';

import {
  deletePhone,
  registerPhone,
  resendVerifySMS,
  verifyPhone,
} from '@App/modules/user/controllers/customer-phone.controller';
import { authenticate, authorize } from '@user/middleware/auth';
import {
  registerPhoneSchema,
  verifyPhoneSchema,
} from '@user/middleware/validators/phones.validator';

const customerPhoneRouter = Router();

customerPhoneRouter.use(authenticate, authorize(['customer']));

customerPhoneRouter.post(
  '',
  trimRequestBody,
  validate(registerPhoneSchema),
  registerPhone,
);
customerPhoneRouter.patch('/resend', resendVerifySMS);
customerPhoneRouter.patch('/:otp', validate(verifyPhoneSchema), verifyPhone);
customerPhoneRouter.delete('', deletePhone);

export default customerPhoneRouter;
