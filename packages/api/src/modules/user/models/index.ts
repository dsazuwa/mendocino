import Address, { DropOffType } from './address.model';
import AdminAccount from './admin-account.model';
import AdminOTP, { AdminOTPType } from './admin-otp.model';
import AdminPhone, { AdminPhoneStatusType } from './admin-phone.model';
import AdminRefreshToken from './admin-refresh-token.model';
import AdminRole from './admin-role.model';
import Admin, { AdminStatusType } from './admin.model';
import CustomerAddress from './customer-address';
import CustomerEmail from './customer-email.model';
import CustomerIdentity, { ProviderType } from './customer-identity.model';
import CustomerOTP, { CustomerOTPType } from './customer-otp.model';
import CustomerPassword from './customer-password.model';
import CustomerPhone, { CustomerPhoneStatusType } from './customer-phone.model';
import CustomerRefreshToken from './customer-refresh-token.model';
import Customer, { CustomerStatusType } from './customer.model';
import Email from './email.model';
import Guest from './guest';
import GuestAddress from './guest-address.model';
import Phone from './phone.model';
import Role from './role.model';

Admin.hasOne(AdminAccount, { foreignKey: 'adminId', onDelete: 'CASCADE' });
AdminAccount.belongsTo(Admin, { foreignKey: 'adminId', onDelete: 'CASCADE' });

Customer.hasOne(CustomerEmail, {
  foreignKey: 'customerId',
  onDelete: 'CASCADE',
});
CustomerEmail.belongsTo(Customer, {
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

Email.hasOne(CustomerEmail, {
  foreignKey: 'emailId',
  onDelete: 'CASCADE',
});
CustomerEmail.belongsTo(Email, {
  foreignKey: 'emailId',
  onDelete: 'CASCADE',
});

CustomerPassword.belongsTo(Customer, {
  foreignKey: 'customerId',
  onDelete: 'CASCADE',
});
Customer.hasOne(CustomerPassword, {
  foreignKey: 'customerId',
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

Customer.hasMany(CustomerAddress, {
  foreignKey: 'customerId',
  onDelete: 'CASCADE',
});
CustomerAddress.belongsTo(Customer, {
  foreignKey: 'customerId',
  onDelete: 'CASCADE',
});

Address.hasMany(CustomerAddress, {
  foreignKey: 'addressId',
  onDelete: 'CASCADE',
});
CustomerAddress.belongsTo(Address, {
  foreignKey: 'addressId',
  onDelete: 'CASCADE',
});

Guest.hasMany(GuestAddress, { foreignKey: 'guestId', onDelete: 'CASCADE' });
GuestAddress.belongsTo(Guest, { foreignKey: 'guestId', onDelete: 'CASCADE' });

Address.hasMany(GuestAddress, { foreignKey: 'addressId', onDelete: 'CASCADE' });
GuestAddress.belongsTo(Address, {
  foreignKey: 'addressId',
  onDelete: 'CASCADE',
});

Admin.hasMany(AdminRefreshToken, {
  foreignKey: 'adminId',
  onDelete: 'CASCADE',
});
AdminRefreshToken.belongsTo(Admin, {
  foreignKey: 'adminId',
  onDelete: 'CASCADE',
});

Customer.hasMany(CustomerRefreshToken, {
  foreignKey: 'customerId',
  onDelete: 'CASCADE',
});
CustomerRefreshToken.belongsTo(Customer, {
  foreignKey: 'customerId',
  onDelete: 'CASCADE',
});

export {
  Address,
  Admin,
  AdminAccount,
  AdminOTP,
  AdminOTPType,
  AdminPhone,
  AdminPhoneStatusType,
  AdminRefreshToken,
  AdminRole,
  AdminStatusType,
  Customer,
  CustomerAddress,
  CustomerEmail,
  CustomerIdentity,
  CustomerOTP,
  CustomerOTPType,
  CustomerPassword,
  CustomerPhone,
  CustomerPhoneStatusType,
  CustomerRefreshToken,
  CustomerStatusType,
  DropOffType,
  Email,
  Guest,
  GuestAddress,
  Phone,
  ProviderType,
  Role,
};
