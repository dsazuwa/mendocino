import Address from './address.model';
import AdminAccount, { AdminAccountStatusType } from './admin-account.model';
import AdminOTP, { AdminOTPType } from './admin-otp.model';
import AdminPhone, { AdminPhoneStatusType } from './admin-phone.model';
import AdminRole from './admin-role.model';
import Admin from './admin.model';
import CustomerAccount, {
  CustomerAccountStatusType,
} from './customer-account.model';
import CustomerIdentity, { ProviderType } from './customer-identity.model';
import CustomerOTP, { CustomerOTPType } from './customer-otp.model';
import CustomerPhone, { CustomerPhoneStatusType } from './customer-phone.model';
import Customer from './customer.model';
import Email from './email.model';
import Phone from './phone.model';
import Role from './role.model';

Admin.hasOne(AdminAccount, { foreignKey: 'adminId', onDelete: 'CASCADE' });
AdminAccount.belongsTo(Admin, { foreignKey: 'adminId', onDelete: 'CASCADE' });

Customer.hasOne(CustomerAccount, {
  foreignKey: 'customerId',
  onDelete: 'CASCADE',
});
CustomerAccount.belongsTo(Customer, {
  foreignKey: 'customerId',
  onDelete: 'CASCADE',
});

Email.hasOne(AdminAccount, {
  foreignKey: 'emailId',
  onDelete: 'CASCADE',
});
AdminAccount.belongsTo(Email, {
  foreignKey: 'emailId',
  onDelete: 'CASCADE',
});

Email.hasOne(CustomerAccount, {
  foreignKey: 'emailId',
  onDelete: 'CASCADE',
});
CustomerAccount.belongsTo(Email, {
  foreignKey: 'emailId',
  onDelete: 'CASCADE',
});

Admin.hasMany(AdminOTP, { foreignKey: 'adminId', onDelete: 'CASCADE' });
AdminOTP.belongsTo(Admin, {
  foreignKey: 'adminId',
  onDelete: 'CASCADE',
});

Customer.hasMany(CustomerOTP, {
  foreignKey: 'customerId',
  onDelete: 'CASCADE',
});
CustomerOTP.belongsTo(Customer, {
  foreignKey: 'customerId',
  onDelete: 'CASCADE',
});

Customer.hasMany(CustomerIdentity, {
  foreignKey: 'customerId',
  onDelete: 'CASCADE',
});
CustomerIdentity.belongsTo(Customer, {
  foreignKey: 'customerId',
  onDelete: 'CASCADE',
});

Role.belongsToMany(Admin, {
  through: 'AdminRole',
  foreignKey: 'roleId',
  onDelete: 'CASCADE',
});
Admin.belongsToMany(Role, {
  through: 'AdminRole',
  foreignKey: 'adminId',
  onDelete: 'CASCADE',
});

AdminPhone.belongsTo(Phone, {
  foreignKey: 'phoneId',
  onDelete: 'CASCADE',
});
Phone.hasOne(AdminPhone, {
  foreignKey: 'phoneId',
  onDelete: 'CASCADE',
});

AdminPhone.belongsTo(Admin, {
  foreignKey: 'adminId',
  onDelete: 'CASCADE',
});
Admin.hasOne(AdminPhone, {
  foreignKey: 'adminId',
  onDelete: 'CASCADE',
});

CustomerPhone.belongsTo(Phone, {
  foreignKey: 'phoneId',
  onDelete: 'CASCADE',
});
Phone.hasOne(CustomerPhone, {
  foreignKey: 'phoneId',
  onDelete: 'CASCADE',
});

CustomerPhone.belongsTo(Customer, {
  foreignKey: 'customerId',
  onDelete: 'CASCADE',
});
Customer.hasOne(CustomerPhone, {
  foreignKey: 'customerId',
  onDelete: 'CASCADE',
});

Customer.hasMany(Address, { foreignKey: 'customerId', onDelete: 'CASCADE' });
Address.belongsTo(Customer, { foreignKey: 'customerId', onDelete: 'CASCADE' });

export {
  Address,
  Admin,
  AdminAccount,
  AdminAccountStatusType,
  AdminOTP,
  AdminOTPType,
  AdminPhone,
  AdminPhoneStatusType,
  AdminRole,
  Customer,
  CustomerAccount,
  CustomerAccountStatusType,
  CustomerIdentity,
  CustomerOTP,
  CustomerOTPType,
  CustomerPhone,
  CustomerPhoneStatusType,
  Email,
  Phone,
  ProviderType,
  Role,
};
