import { Router } from 'express';

import { trimRequestBody, validate } from '../../../middleware';
import {
  deletePhone,
  registerPhone,
  resendVerifySMS,
  verifyPhone,
} from '../controllers/customer-phone.controller';
import { authenticate, authorize } from '../middleware/auth';
import {
  registerPhoneSchema,
  verifyPhoneSchema,
} from '../middleware/validators/phones.validator';

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
