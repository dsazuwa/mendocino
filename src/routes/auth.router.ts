import { Router } from 'express';
import { login, logout, register } from '../controllers/auth.controller';
import { loginRules, registerRules, validate } from '../middleware';

export const authRouter = Router();

authRouter.post('/register', registerRules, validate, register);
authRouter.post('/login', loginRules, validate, login);
authRouter.post('/logout', logout);
