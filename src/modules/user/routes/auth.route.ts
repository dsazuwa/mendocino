import { Router } from 'express';
import passport from 'passport';

import { googleLogin } from '@user/controllers/auth.controller';

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

export default authRouter;
