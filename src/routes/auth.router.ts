import { Router } from 'express';
import {
  login,
  logout,
  recoverPassword,
  register,
  requestPasswordRecovery,
  verifyRecoveryCode,
} from '../controllers/auth.controller';
import { loginRules, passwordRules, registerRules } from '../middleware/auth.validator';
import validate from '../middleware/validate';

export const authRouter = Router();

authRouter.post('/register', registerRules, validate, register);
authRouter.post('/login', loginRules, validate, login);
authRouter.post('/logout', logout);

authRouter.post('/recover', requestPasswordRecovery);
authRouter.post('/recover/:code', verifyRecoveryCode);
authRouter.put('/recover/:code', passwordRules, validate, recoverPassword);
