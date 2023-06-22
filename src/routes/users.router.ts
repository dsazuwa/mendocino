import { Request, Response, Router } from 'express';
import { resendVerify, verifyEmail } from '../controllers/users.controller';
import { authenticate } from '../middleware';
import { permitOnlyPendingUsers } from '../middleware/auth.middleware';

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get('/me', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hey User' });
});

usersRouter.post('/me/verify', permitOnlyPendingUsers, resendVerify);
usersRouter.put('/me/verify/:code', permitOnlyPendingUsers, verifyEmail);
