import { Router } from 'express';
import { getUser, resendVerify, verifyEmail } from '../controllers/users.controller';
import { authenticate } from '../middleware';
import { permitOnlyPendingUsers } from '../middleware/auth.middleware';
import { codeRules } from '../middleware/user.validator';
import validate from '../middleware/validate';

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get('/me', getUser);

usersRouter.post('/me/verify', permitOnlyPendingUsers, resendVerify);
usersRouter.put('/me/verify/:code', permitOnlyPendingUsers, codeRules, validate, verifyEmail);
