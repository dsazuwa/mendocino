import { authenticate, configureJWTStrategy, permitOnlyPendingUsers } from './auth.middleware';
import { loginRules, registerRules, validate } from './validator.middleware';

export { authenticate, configureJWTStrategy, loginRules, permitOnlyPendingUsers, registerRules, validate };
