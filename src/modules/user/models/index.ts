import Address from './address.model';
import AuthOTP, { AuthOTPType } from './auth-otp.model';
import PhoneNumber, { PhoneNumberStatusype } from './phone-number.model';
import Role from './role.model';
import UserAccount, { UserAccountStatusType } from './user-account.model';
import UserIdentity, { ProviderType } from './user-identity.model';
import UserRole from './user-role.model';
import User from './user.model';

User.hasOne(UserAccount, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserAccount.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

User.hasMany(UserIdentity, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserIdentity.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

UserAccount.hasMany(AuthOTP, { foreignKey: 'userId', onDelete: 'CASCADE' });
AuthOTP.belongsTo(UserAccount, { foreignKey: 'userId', onDelete: 'CASCADE' });

Role.belongsToMany(User, {
  through: 'UserRole',
  foreignKey: 'roleId',
  onDelete: 'CASCADE',
});
User.belongsToMany(Role, {
  through: 'UserRole',
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

User.hasMany(Address, { foreignKey: 'userId', onDelete: 'CASCADE' });
Address.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

User.hasOne(PhoneNumber, { foreignKey: 'userId', onDelete: 'CASCADE' });
PhoneNumber.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

export {
  Address,
  AuthOTP,
  AuthOTPType,
  PhoneNumber,
  PhoneNumberStatusype,
  ProviderType,
  Role,
  User,
  UserAccount,
  UserAccountStatusType,
  UserIdentity,
  UserRole,
};
