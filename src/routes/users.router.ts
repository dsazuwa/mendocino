import { Router } from 'express';
import { getUser, resendVerify, verifyEmail } from '../controllers/users.controller';
import { authenticate } from '../middleware';
import { permitOnlyPending } from '../middleware/auth.middleware';
import validate, { codeRules } from '../middleware/validator';

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get('/me', getUser);

usersRouter.post('/me/verify', permitOnlyPending, resendVerify);
usersRouter.put('/me/verify/:code', permitOnlyPending, codeRules, validate, verifyEmail);
