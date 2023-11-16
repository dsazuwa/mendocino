import { Router } from 'express';

import { trimRequestBody, validate } from '../../../middleware';
import {
  changePassword,
  updateUserName,
} from '../controllers/admin.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import {
  changePasswordSchema,
  updateUserNameSchema,
} from '../middleware/validators/users.validator';

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
