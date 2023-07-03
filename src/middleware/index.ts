import { authenticate, configureJWTStrategy, permitOnlyPendingUsers } from './auth.middleware';
import { errorMiddleware, notFoundHandler } from './error.middleware';

export {
  authenticate,
  configureJWTStrategy,
  errorMiddleware,
  notFoundHandler,
  permitOnlyPendingUsers,
};
