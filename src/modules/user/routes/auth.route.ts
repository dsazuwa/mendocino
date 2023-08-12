import { Router } from 'express';
import passport from 'passport';

import { trimRequestBody, validate } from '@App/middleware';

import {
  facebookLogin,
  googleLogin,
  login,
  logout,
  reactivate,
  recoverPassword,
  register,
  requestPasswordRecovery,
  verifyRecoveryOTP,
} from '@user/controllers/auth.controller';
import { authenticateInactive } from '@user/middleware/auth/inactive.auth';
import {
  loginRules,
  recoverRules,
  registerRules,
  requestRecoverRules,
  verifyOTPRules,
} from '@user/middleware/validators/auth.validator';

const authRouter = Router();

authRouter.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
);
authRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleLogin,
);

authRouter.get(
  '/facebook',
  passport.authenticate('facebook', {
    session: false,
    scope: ['profile', 'email'],
  }),
);
authRouter.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  facebookLogin,
);

authRouter.post(
  '/register',
  trimRequestBody,
  registerRules,
  validate,
  register,
);

authRouter.post('/login', trimRequestBody, loginRules, validate, login);

authRouter.post('/logout', logout);

authRouter.post(
  '/recover',
  requestRecoverRules,
  validate,
  requestPasswordRecovery,
);
authRouter.post('/recover/:otp', verifyOTPRules, validate, verifyRecoveryOTP);
authRouter.patch('/recover/:otp', recoverRules, validate, recoverPassword);

authRouter.patch('/reactivate', authenticateInactive, reactivate);

export default authRouter;
