import { Request, Response, Router } from 'express';
import {
  requestResetCode,
  resendVerify,
  resetPassword,
  verifyEmail,
} from '../controllers/users.controller';
import { authenticate, validate } from '../middleware';
import { permitOnlyPendingUsers } from '../middleware/auth.middleware';
import { passwordRules } from '../middleware/validator.middleware';

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get('/me', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hey User' });
});

usersRouter.post('/me/verify', permitOnlyPendingUsers, resendVerify);
usersRouter.put('/me/verify/:code', permitOnlyPendingUsers, verifyEmail);

usersRouter.post('/me/reset', requestResetCode);
usersRouter.put('/me/reset/:code', passwordRules, validate, resetPassword);
