import {
  codeRules,
  loginRules,
  passwordRules,
  recoverPasswordRules,
  registerRules,
} from './auth.validator';
import { allowedGroupByFields, getByIdRules, menuGroupingRules } from './menu.validator';
import validate from './validate';

export {
  allowedGroupByFields,
  codeRules,
  getByIdRules,
  loginRules,
  menuGroupingRules,
  passwordRules,
  recoverPasswordRules,
  registerRules,
};

export default validate;
