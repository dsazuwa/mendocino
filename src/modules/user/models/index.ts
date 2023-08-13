import AuthOTP, { AuthOTPType } from './auth-otp.model';
import UserAccount, { UserAccountStatusType } from './user-account.model';
import UserIdentity, { ProviderType } from './user-identity.model';
import User from './user.model';

User.hasOne(UserAccount, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserAccount.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

User.hasMany(UserIdentity, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserIdentity.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

UserAccount.hasMany(AuthOTP, { foreignKey: 'userId', onDelete: 'CASCADE' });
AuthOTP.belongsTo(UserAccount, { foreignKey: 'userId', onDelete: 'CASCADE' });

export {
  AuthOTP,
  AuthOTPType,
  ProviderType,
  User,
  UserAccount,
  UserAccountStatusType,
  UserIdentity,
};
