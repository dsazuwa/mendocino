import { Router } from 'express';

import { trimRequestBody, validate } from '../../../middleware';
import {
  deletePhone,
  registerPhone,
  resendVerifySMS,
  verifyPhone,
} from '../controllers/admin-phone.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import {
  registerPhoneSchema,
  verifyPhoneSchema,
} from '../middleware/validators/phones.validator';

const adminPhoneRouter = Router();

adminPhoneRouter.use(authenticate, authorizeAdmin);

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
