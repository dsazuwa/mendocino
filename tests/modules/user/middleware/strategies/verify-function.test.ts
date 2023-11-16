import { Profile } from 'passport';

import verifyFunction from 'modules/user/middleware/strategies/verify-function';
import {
  Customer,
  CustomerIdentity,
  Email,
  ProviderType,
} from 'modules/user/models';
import authService from 'modules/user/services/auth.service';
import { ROLES } from 'modules/user/utils/constants';
import messages from 'modules/user/utils/messages';
import { ApiError } from 'utils';

import {
  createAdmin,
  createCustomer,
  createCustomerAndIdentity,
  createRoles,
} from '../../helper-functions';

import '../../../../db-setup';

const raw = true;

beforeAll(async () => {
  createRoles();
});

const done = jest.fn();

const callVerify = async (
  identityId: string,
  firstName: string,
  lastName: string,
  email: string,
  provider: ProviderType,
) => {
  const profile = {
    id: identityId,
    emails: [{ value: email }],
    name: { givenName: firstName, familyName: lastName },
  } as unknown as Profile;

  await verifyFunction(profile, done, provider);
};

it('should create customer if they do not exist', async () => {
  const identityId = '213254657845231';
  const provider = 'google';
  const firstName = 'Joseph';
  const lastName = 'Doe';
  const email = 'josephdoe@gmail.com';

  let c = await Customer.findOne({ where: { firstName, lastName }, raw });
  let e = await Email.findOne({ where: { email }, raw });
  let i = await CustomerIdentity.findOne({ where: { identityId }, raw });

  expect(c).toBeNull();
  expect(e).toBeNull();
  expect(i).toBeNull();

  await callVerify(identityId, firstName, lastName, email, 'google');

  c = await Customer.findOne({ where: { firstName, lastName }, raw });
  e = await Email.findOne({ where: { email }, raw });
  i = await CustomerIdentity.findOne({
    where: { identityId, customerId: c?.customerId, provider },
    raw,
  });

  expect(c).not.toBeNull();
  expect(e).not.toBeNull();
  expect(i).not.toBeNull();
});

it('should create new identity if CustomerEmail exists (active) but CustomerIdentity does not', async () => {
  const identityId = '242739758613728489';
  const firstName = 'Jacquelin';
  const lastName = 'Doe';
  const email = 'jacquelindoe@gmail.com';
  const password = 'jacqD0ePa$$';
  const provider = 'facebook';

  const { customerId } = await createCustomer(
    firstName,
    lastName,
    email,
    password,
    'active',
  );

  let i = await CustomerIdentity.findOne({
    where: { identityId, customerId },
    raw,
  });
  expect(i).toBeNull();

  await callVerify(identityId, firstName, lastName, email, provider);

  i = await CustomerIdentity.findOne({
    where: { identityId, customerId, provider },
    raw,
  });
  expect(i).not.toBeNull();
});

it('should create new identity if Customer exists (pending) but CustomerIdentity does not', async () => {
  const identityId = '53849274264293027498';
  const provider = 'facebook';
  const firstName = 'Jean';
  const lastName = 'Doe';
  const email = 'jeandoe@gmail.com';
  const password = 'jeanD0ePa$$';

  const { customerId } = await createCustomer(
    firstName,
    lastName,
    email,
    password,
    'pending',
  );

  let c = await Customer.findOne({
    where: { customerId, status: 'pending' },
    raw,
  });
  let i = await CustomerIdentity.findOne({
    where: { identityId, customerId },
    raw,
  });

  expect(c).not.toBeNull();
  expect(i).toBeNull();

  await callVerify(identityId, firstName, lastName, email, provider);

  c = await Customer.findOne({
    where: { customerId, status: 'active' },
    raw,
  });
  i = await CustomerIdentity.findOne({
    where: { identityId, customerId, provider },
    raw,
  });

  expect(c).not.toBeNull();
  expect(i).not.toBeNull();
});

it('should "login" user if both CustomerEmail and CustomerIdentity exists', async () => {
  const identityId = '583683462429535730';
  const firstName = 'Jules';
  const lastName = 'Doe';
  const email = 'julesdoe@gmail.com';
  const password = 'julesD0ePa$$';
  const provider = 'google';

  await createCustomerAndIdentity(
    firstName,
    lastName,
    email,
    password,
    'active',
    [{ identityId, provider }],
  );

  const {
    createIdentityForCustomer,
    createCustomerAndIdentity: serviceCreateCustomerAndIdentity,
  } = authService;

  const a = jest.fn();
  const b = jest.fn();

  authService.createIdentityForCustomer = a;
  authService.createCustomerAndIdentity = b;

  await callVerify(identityId, firstName, lastName, email, provider);

  expect(a).not.toHaveBeenCalled();
  expect(b).not.toHaveBeenCalled();

  authService.createIdentityForCustomer = createIdentityForCustomer;
  authService.createCustomerAndIdentity = serviceCreateCustomerAndIdentity;
});

it('should return error if identity exists but not for user with provided email', async () => {
  const firstName = 'Juniper';
  const lastName = 'Doe';
  const email = 'juniperdoe@gmail.com';
  const password = 'junipeD0ePa$$';
  const identityId = '85930847728963982469';
  const provider = 'facebook';

  await createCustomerAndIdentity(
    firstName,
    lastName,
    email,
    password,
    'active',
    [{ identityId, provider }],
  );

  const { email: juanEmail } = await createCustomer(
    'Juan',
    'Doe',
    'juandoe@gmail.com',
    'juaneD0ePa$$',
    'active',
  );

  await callVerify(identityId, firstName, lastName, juanEmail.email, provider);

  expect(done).toHaveBeenLastCalledWith(
    ApiError.unauthorized(messages.ERR_THIRD_PARTY_AUTH_MISMATCH),
  );
});

it('should return error if customer exists, but is admin', async () => {
  const identityId = '6988232978752892';
  const firstName = 'Jerome';
  const lastName = 'Doe';
  const email = 'jeromedoe@gmail.com';
  const password = 'jeromeD0ePa$$';
  const provider = 'google';

  await createAdmin(firstName, lastName, email, password, 'active', [
    ROLES.SUPER_ADMIN.roleId,
  ]);

  let i = await CustomerIdentity.findOne({
    where: { identityId, provider },
    raw,
  });
  expect(i).toBeNull();

  await callVerify(identityId, firstName, lastName, email, provider);

  expect(done).toHaveBeenLastCalledWith(
    ApiError.unauthorized(messages.ERR_THIRD_PARTY_AUTH_ADMIN),
  );

  i = await CustomerIdentity.findOne({ where: { identityId, provider }, raw });
  expect(i).toBeNull();
});

it('should return error if customer exists (deactivated)', async () => {
  const identityId = '6988232978752892';
  const firstName = 'Jacquet';
  const lastName = 'Doe';
  const email = 'jacquetdoe@gmail.com';
  const password = 'jacquetD0ePa$$';

  const { customerId } = await createCustomer(
    firstName,
    lastName,
    email,
    password,
    'deactivated',
  );

  const i = await CustomerIdentity.findOne({
    where: { identityId, customerId },
    raw,
  });
  expect(i).toBeNull();

  await callVerify(identityId, firstName, lastName, email, 'google');

  expect(done).toHaveBeenLastCalledWith(
    ApiError.unauthorized(messages.ERR_DEACTIVATED_ACCOUNT),
  );
});

it('should return error if customer exists (suspended)', async () => {
  const identityId = '59837803748027482';
  const firstName = 'Jacquet';
  const lastName = 'Doe';
  const email = 'notjacquet@gmail.com';
  const password = 'jacquetD0ePa$$';

  const { customerId } = await createCustomer(
    firstName,
    lastName,
    email,
    password,
    'suspended',
  );

  const i = await CustomerIdentity.findOne({
    where: { identityId, customerId },
    raw,
  });
  expect(i).toBeNull();

  await callVerify(identityId, firstName, lastName, email, 'google');

  expect(done).toHaveBeenLastCalledWith(
    ApiError.unauthorized(messages.ERR_SUSPENDED_ACCOUNT),
  );
});
