import { Router } from 'express';

import { trimRequestBody, validate } from '@App/middleware';

import {
  deletePhone,
  registerPhone,
  resendVerifySMS,
  verifyPhone,
} from '@user/controllers/phones.controller';
import { authenticate } from '@user/middleware/auth';
import {
  registerPhoneSchema,
  verifyPhoneSchema,
} from '@user/middleware/validators/phones.validator';

const phonesRouter = Router();

phonesRouter.use(authenticate);

phonesRouter.post(
  '',
  trimRequestBody,
  validate(registerPhoneSchema),
  registerPhone,
);
phonesRouter.patch('/resend', resendVerifySMS);
phonesRouter.patch('/:otp', validate(verifyPhoneSchema), verifyPhone);
phonesRouter.delete('', deletePhone);

export default phonesRouter;
