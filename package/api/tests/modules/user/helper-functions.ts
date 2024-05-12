import sequelize from '@app/db';
import {
  Admin,
  AdminAccount,
  AdminRole,
  AdminStatusType,
  Customer,
  CustomerEmail,
  CustomerIdentity,
  CustomerPassword,
  CustomerStatusType,
  Email,
  ProviderType,
  Role,
} from '@app/modules/user/models';
import { ROLES } from '@app/modules/user/utils/constants';

export const createCustomer = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  status: CustomerStatusType,
) =>
  sequelize.transaction(async (transaction) => {
    const customer = await Customer.create(
      { firstName, lastName, status },
      { transaction },
    );

    const { customerId } = customer;

    const customerEmail = await Email.create({ email }, { transaction });

    await CustomerEmail.create(
      {
        customerId,
        emailId: customerEmail.emailId,
      },
      { transaction },
    );

    const p = await CustomerPassword.create(
      { customerId, password },
      { transaction },
    );

    return { customerId, customer, email: customerEmail, password: p };
  });

export const createCustomerAndIdentity = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string | null,
  status: CustomerStatusType,
  identities: { identityId: string; provider: ProviderType }[],
) =>
  sequelize.transaction(async (transaction) => {
    const customer = await Customer.create(
      { firstName, lastName, status },
      { transaction },
    );

    const { customerId } = customer;

    const adminEmail = await Email.create({ email }, { transaction });

    await CustomerEmail.create(
      {
        customerId,
        emailId: adminEmail.emailId,
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
      password: p,
      createdIdentities,
    };
  });

export const createAdmin = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  status: AdminStatusType,
  roles: number[],
) =>
  sequelize.transaction(async (transaction) => {
    const admin = await Admin.create(
      { firstName, lastName, status },
      { transaction },
    );

    const { adminId } = admin;

    const adminEmail = await Email.create({ email }, { transaction });

    const account = await AdminAccount.create(
      {
        adminId,
        emailId: adminEmail.emailId,
        password,
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
    ROLES.SUPER_ADMIN,
    ROLES.ROOT,
  ]);
};
