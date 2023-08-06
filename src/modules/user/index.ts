import { authenticate } from './middleware/auth/auth';
import { authenticateInactive } from './middleware/auth/inactive.auth';

import { configureGoogleStrategy } from './middleware/strategies/google.strategy';
import { configureJWTStrategy } from './middleware/strategies/jwt.strategy';

import userRouter from './routes';

export {
  authenticate,
  authenticateInactive,
  configureGoogleStrategy,
  configureJWTStrategy,
  userRouter,
};
