import { Router } from 'express';
import passport from 'passport';

import { facebookLogin, googleLogin } from '@user/controllers/auth.controller';

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

export default authRouter;
