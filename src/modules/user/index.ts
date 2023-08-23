import authenticate from './middleware/auth/authenticate';
import authorize from './middleware/auth/authorize';
import authorizeAdmin from './middleware/auth/authorize.admin';
import authenticateInactive from './middleware/auth/inactive.authenticate';

import { configureGoogleStrategy } from './middleware/strategies/google.strategy';
import { configureJWTStrategy } from './middleware/strategies/jwt.strategy';

import userRouter from './routes';

import { ROLES } from './utils/constants';

export {
  ROLES,
  authenticate,
  authenticateInactive,
  authorize,
  authorizeAdmin,
  configureGoogleStrategy,
  configureJWTStrategy,
  userRouter,
};
