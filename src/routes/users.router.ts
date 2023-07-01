import { Router } from 'express';
import { getUser, resendVerify, verifyEmail } from '../controllers/users.controller';
import { authenticate } from '../middleware';
import { permitOnlyPendingUsers } from '../middleware/auth.middleware';

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get('/me', getUser);

usersRouter.post('/me/verify', permitOnlyPendingUsers, resendVerify);
usersRouter.put('/me/verify/:code', permitOnlyPendingUsers, verifyEmail);
