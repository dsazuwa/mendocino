import {
  Admin,
  AdminAccount,
  AdminAccountStatusType,
  AdminRole,
  Customer,
  CustomerAccount,
  CustomerAccountStatusType,
  CustomerIdentity,
  Email,
  ProviderType,
  Role,
} from '@user/models';
import { ROLES } from '@user/utils/constants';

export const createCustomer = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string | null,
  status: CustomerAccountStatusType,
) => {
  const customer = await Customer.create({ firstName, lastName });

  const { customerId } = customer;

  const { emailId } = await Email.create({ email });

  const account = await CustomerAccount.create({
    customerId,
    emailId,
    password,
    status,
  });

  return { customerId, customer, account };
};

export const createUserAccountAndIdentity = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string | null,
  status: CustomerAccountStatusType,
  identities: { identityId: string; provider: ProviderType }[],
) => {
  const customer = await Customer.create({ firstName, lastName });

  const { customerId } = customer;

  const { emailId } = await Email.create({ email });

  const account = await CustomerAccount.create({
    customerId,
    emailId,
    password,
    status,
  });

  const identityMappings = identities.map(({ identityId, provider }) => ({
    customerId,
    identityId,
    provider,
  }));
  const createdIdentities = await CustomerIdentity.bulkCreate(identityMappings);

  return { customerId, customer, account, identitities: createdIdentities };
};

export const createAdmin = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  status: AdminAccountStatusType,
  roles: number[],
) => {
  const admin = await Admin.create({ firstName, lastName });

  const { adminId } = admin;

  const { emailId } = await Email.create({ email });

  const account = await AdminAccount.create({
    adminId,
    emailId,
    password,
    status,
  });

  const roleMappings = roles.map((roleId) => ({ adminId, roleId }));
  await AdminRole.bulkCreate(roleMappings);

  return { adminId, admin, account };
};

export const createRoles = async () => {
  await Role.bulkCreate([
    ROLES.DELIVERY_DRIVER,
    ROLES.CUSTOMER_SUPPORT,
    ROLES.MANAGER,
    ROLES.SUPER_USER,
    ROLES.ROOT,
  ]);
};
