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
import { authenticateInactive } from '@user/middleware/auth';
import {
  loginSchema,
  recoverPasswordSchema,
  registerSchema,
  requestRecoverySchema,
  verifyRecoveryOTPSchema,
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
  validate(registerSchema),
  register,
);

authRouter.post('/login', trimRequestBody, validate(loginSchema), login);

authRouter.post('/logout', logout);

authRouter.post(
  '/recover',
  validate(requestRecoverySchema),
  requestPasswordRecovery,
);
authRouter.post(
  '/recover/:otp',
  validate(verifyRecoveryOTPSchema),
  verifyRecoveryOTP,
);
authRouter.patch(
  '/recover/:otp',
  validate(recoverPasswordSchema),
  recoverPassword,
);

authRouter.patch('/reactivate', authenticateInactive, reactivate);

export default authRouter;
