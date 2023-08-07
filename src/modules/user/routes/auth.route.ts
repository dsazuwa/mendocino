import { Router } from 'express';
import passport from 'passport';

import { trimRequestBody, validate } from '@App/middleware';

import {
  facebookLogin,
  googleLogin,
  login,
  register,
} from '@user/controllers/auth.controller';
import {
  loginRules,
  registerRules,
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

export default authRouter;
