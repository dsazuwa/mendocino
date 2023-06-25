import { authenticate, configureJWTStrategy, permitOnlyPendingUsers } from './auth.middleware';
import { errorMiddleware, notFoundHandler } from './error.middleware';
import { loginRules, registerRules, validate } from './validator.middleware';

export {
  authenticate,
  configureJWTStrategy,
  errorMiddleware,
  loginRules,
  notFoundHandler,
  permitOnlyPendingUsers,
  registerRules,
  validate,
};
