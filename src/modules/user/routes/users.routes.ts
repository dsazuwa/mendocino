import { Router } from 'express';

import { validate } from '@App/middleware';

import {
  changePassword,
  getUserData,
  greet,
  resendVerifyEmail,
  verifyEmail,
} from '@user/controllers/users.controller';
import { authenticate, authenticateInactive } from '@user/middleware/auth';
import { permitPending } from '@user/middleware/route-guards';
import {
  changePasswordSchema,
  verifyEmailSchema,
} from '@user/middleware/validators/users.validator';

const usersRouter = Router();

usersRouter.get('/me/inactive/greeting', authenticateInactive, greet);

usersRouter.use(authenticate);

usersRouter.get('/me/greeting', greet);

usersRouter.get('/me', getUserData);

usersRouter.post('/me/verify', permitPending, resendVerifyEmail);
usersRouter.patch(
  '/me/verify/:otp',
  validate(verifyEmailSchema),
  permitPending,
  verifyEmail,
);

usersRouter.patch(
  '/me/password',
  validate(changePasswordSchema),
  changePassword,
);

export default usersRouter;
