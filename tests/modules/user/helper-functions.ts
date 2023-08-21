import sequelize from '@App/db';
import {
  Admin,
  AdminAccount,
  AdminAccountStatusType,
  AdminRole,
  Customer,
  CustomerAccount,
  CustomerAccountStatusType,
  CustomerIdentity,
  CustomerPassword,
  Email,
  ProviderType,
  Role,
} from '@user/models';
import { ROLES } from '@user/utils/constants';

export const createCustomer = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  status: CustomerAccountStatusType,
) =>
  sequelize.transaction(async (transaction) => {
    const customer = await Customer.create(
      { firstName, lastName },
      { transaction },
    );

    const { customerId } = customer;

    const customerEmail = await Email.create({ email }, { transaction });

    const account = await CustomerAccount.create(
      {
        customerId,
        emailId: customerEmail.emailId,
        status,
      },
      { transaction },
    );

    const p = await CustomerPassword.create(
      { customerId, password },
      { transaction },
    );

    return { customerId, customer, email: customerEmail, account, password: p };
  });

export const createUserAccountAndIdentity = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string | null,
  status: CustomerAccountStatusType,
  identities: { identityId: string; provider: ProviderType }[],
) =>
  sequelize.transaction(async (transaction) => {
    const customer = await Customer.create(
      { firstName, lastName },
      { transaction },
    );

    const { customerId } = customer;

    const adminEmail = await Email.create({ email }, { transaction });

    const account = await CustomerAccount.create(
      {
        customerId,
        emailId: adminEmail.emailId,
        status,
      },
      { transaction },
    );

    const p = password
      ? await CustomerPassword.create({ customerId, password }, { transaction })
      : null;

    const identityMappings = identities.map(({ identityId, provider }) => ({
      customerId,
      identityId,
      provider,
    }));
    const createdIdentities = await CustomerIdentity.bulkCreate(
      identityMappings,
      { transaction },
    );

    return {
      customerId,
      customer,
      email: adminEmail,
      account,
      password: p,
      createdIdentities,
    };
  });

export const createAdmin = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  status: AdminAccountStatusType,
  roles: number[],
) =>
  sequelize.transaction(async (transaction) => {
    const admin = await Admin.create({ firstName, lastName }, { transaction });

    const { adminId } = admin;

    const adminEmail = await Email.create({ email }, { transaction });

    const account = await AdminAccount.create(
      {
        adminId,
        emailId: adminEmail.emailId,
        password,
        status,
      },
      { transaction },
    );

    const roleMappings = roles.map((roleId) => ({ adminId, roleId }));
    await AdminRole.bulkCreate(roleMappings, { transaction });

    return { adminId, admin, email: adminEmail, account };
  });

export const createRoles = async () => {
  await Role.bulkCreate([
    ROLES.DELIVERY_DRIVER,
    ROLES.CUSTOMER_SUPPORT,
    ROLES.MANAGER,
    ROLES.SUPER_USER,
    ROLES.ROOT,
  ]);
};
