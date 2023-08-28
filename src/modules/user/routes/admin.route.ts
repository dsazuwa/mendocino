import { Router } from 'express';

import { trimRequestBody, validate } from '@App/middleware';

import {
  changePassword,
  updateUserName,
} from '@user/controllers/admin.controller';
import { authenticate, authorizeAdmin } from '@user/middleware/auth';
import {
  changePasswordSchema,
  updateUserNameSchema,
} from '@user/middleware/validators/users.validator';

const adminRouter = Router();

adminRouter.use(authenticate, authorizeAdmin);

adminRouter.patch(
  '/name',
  trimRequestBody,
  validate(updateUserNameSchema),
  updateUserName,
);

adminRouter.patch(
  '/password',
  trimRequestBody,
  validate(changePasswordSchema),
  changePassword,
);

export default adminRouter;
