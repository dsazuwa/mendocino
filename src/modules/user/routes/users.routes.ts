import { Request, Response, Router } from 'express';

import { validate } from '@App/middleware';

import { authenticate, authenticateInactive } from '@user/middleware/auth';
import permitPending from '@user/middleware/route-guards/permit-pending.guard';
import {
  resendVerifyEmail,
  verifyEmail,
} from '@user/controllers/users.controller';
import { verifyEmailRules } from '@user/middleware/validators/users.validator';

const usersRouter = Router();

usersRouter.get(
  '/me/inactive/greeting',
  authenticateInactive,
  (req: Request, res: Response) => {
    res.status(200).json({ message: 'Hi!' });
  },
);

usersRouter.use(authenticate);

usersRouter.get('/me/greeting', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hi!' });
});

usersRouter.post('/me/verify', permitPending, resendVerifyEmail);
usersRouter.patch(
  '/me/verify/:otp',
  verifyEmailRules,
  validate,
  permitPending,
  verifyEmail,
);

export default usersRouter;
