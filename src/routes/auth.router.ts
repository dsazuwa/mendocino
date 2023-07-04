import { Router } from 'express';
import {
  login,
  logout,
  recoverPassword,
  register,
  requestPasswordRecovery,
  verifyRecoveryCode,
} from '../controllers/auth.controller';
import validate, {
  codeRules,
  loginRules,
  recoverPasswordRules,
  registerRules,
} from '../middleware/validator';
import { trimRequestBody } from '../middleware/trim.middleware';

export const authRouter = Router();

authRouter.post('/register', trimRequestBody, registerRules, validate, register);
authRouter.post('/login', trimRequestBody, loginRules, validate, login);
authRouter.post('/logout', logout);

authRouter.post('/recover', requestPasswordRecovery);
authRouter.post('/recover/:code', codeRules, verifyRecoveryCode);
authRouter.put('/recover/:code', trimRequestBody, recoverPasswordRules, validate, recoverPassword);
