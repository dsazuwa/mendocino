import { authenticate, configureJWTStrategy } from './auth.middleware';
import { loginRules, registerRules, validate } from './validator.middleware';

export { authenticate, configureJWTStrategy, loginRules, registerRules, validate };
