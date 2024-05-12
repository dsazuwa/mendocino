import authorizeAdmin from './middleware/auth/admin.authorize';
import authenticate from './middleware/auth/authenticate';
import authorize from './middleware/auth/authorize';
import authenticateInactive from './middleware/auth/inactive.authenticate';
import jwtErrorHandler from './middleware/error/jwt-error-handler';
import extractJwtFromCookie from './middleware/jwt-extractor.middleware';

import { configureGoogleStrategy } from './middleware/strategies/google.strategy';
import { configureJwtStrategy } from './middleware/strategies/jwt.strategy';

import userRouter from './routes';

import { ROLES } from './utils/constants';

export {
  ROLES,
  authenticate,
  authenticateInactive,
  authorize,
  authorizeAdmin,
  configureGoogleStrategy,
  configureJwtStrategy,
  extractJwtFromCookie,
  jwtErrorHandler,
  userRouter,
};
