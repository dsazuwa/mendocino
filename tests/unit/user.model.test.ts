import { config } from 'dotenv';
import { sign } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Address, Token, User, UserRoleType, UserStatusType } from '../../src/models/User';
import '../utils/db-setup';

config();

describe('User Model', () => {
  it('should create user', async () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johnDoe@gmail.com',
      password: 'johnD0ePa$$',
    };

    let user = await User.create(data);
    expect(user.email).toEqual(data.email);

    let fetchedUser = await User.findByPk(user.id);
    expect(fetchedUser).not.toBeNull();

    const data1 = {
      uuid: uuidv4(),
      firstName: 'Jack',
      lastName: 'Doe',
      email: 'jackDoe@gmail.com',
      password: 'jackD0ePa$$',
      status: 'pending' as UserStatusType,
      role: 'client' as UserRoleType,
    };

    user = await User.create(data1);
    expect(user.email).toEqual(data1.email);

    fetchedUser = await User.findByPk(user.id);
    expect(fetchedUser).not.toBeNull();
  });

  it('should retrieve user', async () => {
    const data = {
      uuid: uuidv4(),
      firstName: 'Joseph',
      lastName: 'Doe',
      email: 'joeDoe@gmail.com',
      password: 'joeD0ePa$$',
    };

    const joe = await User.create(data);

    let user = await User.findByPk(joe.id);
    expect(user).not.toBeNull();

    user = await User.findOne({ where: { uuid: joe.uuid } });
    expect(user).not.toBeNull();

    user = await User.findOne({ where: { email: joe.email } });
    expect(user).not.toBeNull();
  });

  it('should update user', async () => {
    const data = {
      uuid: uuidv4(),
      firstName: 'Joy',
      lastName: 'Doe',
      email: 'joyDoe@gmail.com',
      password: 'joyD0ePa$$',
    };

    const user = await User.create(data);

    const newData = {
      firstName: 'June',
      lastName: 'Doe',
      email: 'juneDoe@gmail.com',
    };

    await user.update(newData);

    const updatedUser = await User.findByPk(user.id);
    expect(updatedUser!.firstName).toEqual(newData.firstName);
    expect(updatedUser!.lastName).toEqual(newData.lastName);
    expect(updatedUser!.email).toEqual(newData.email);
  });

  it('should delete user', async () => {
    const data = {
      uuid: uuidv4(),
      firstName: 'Joel',
      lastName: 'Doe',
      email: 'joelDoe@gmail.com',
      password: 'joelD0ePa$$',
    };

    const user = await User.create(data);
    await user.destroy();

    const deletedUser = await User.findByPk(user.id);
    expect(deletedUser).toBeNull();
  });

  it('should fail on duplicate', async () => {
    const data = {
      uuid: uuidv4(),
      firstName: 'Jake',
      lastName: 'Doe',
      email: 'jakeDoe@gmail.com',
      password: 'jakeD0ePa$$',
    };

    await User.create(data);
    expect(User.create(data)).rejects.toThrow();
  });

  it('should fail on invalid data', async () => {
    const data = {
      uuid: uuidv4(),
      firstName: '',
      lastName: '',
      email: 'notemail',
      password: 'passwor',
    };

    expect(User.create(data)).rejects.toThrow();

    const data1 = {
      uuid: uuidv4(),
      firstName: 'Janet',
      lastName: 'Doe',
      email: 'janetdoe@gmail.com',
      password: 'janetD0ePa$$janetD0ePa$$janetD0ePa$$janetD0ePa$$janetD0ePa$$',
    };

    expect(User.create(data1)).rejects.toThrow();
  });

  it('should hash the password', async () => {
    const data = {
      uuid: uuidv4(),
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'janeDoe@gmail.com',
      password: 'janeD0ePa$$',
    };

    const user = await User.create(data);
    expect(user.password).not.toEqual(data.password);
    expect(user.comparePasswords(data.password)).toBeTruthy();
  });

  it('should generate a valid JWT token', async () => {
    const data = {
      uuid: uuidv4(),
      firstName: 'Jade',
      lastName: 'Doe',
      email: 'jadedoe@gmail.com',
      password: 'jadeD0ePa$$',
    };

    const user = await User.create(data);

    const token = user.generateJWT();
    expect(token).toBeDefined();

    const decoded = sign({ uuid: user.uuid, email: user.email }, `${process.env.JWT_SECRET}`, { expiresIn: '60 days' });
    expect(token).toEqual(decoded);
  });
});

describe('Address Model', () => {
  let user: User;

  beforeAll(async () => {
    user = await User.create({
      uuid: uuidv4(),
      firstName: 'James',
      lastName: 'Doe',
      email: 'jamesdoe@gmail.com',
      password: 'jamesD0ePa$$',
    });
  });

  it('should create address', async () => {
    const data = {
      userId: user.id,
      addressLine1: '1957 Kembery Drive',
      city: 'Roselle',
      state: 'IL',
      postalCode: '60172',
    };

    let address = await Address.create(data);
    let retrievedAddress = await Address.findOne({ where: { id: address.id, userId: user.id } });
    expect(retrievedAddress).not.toBeNull();

    const data1 = {
      addressLine1: '1957 Kembery Drive',
      city: 'Roselle',
      state: 'IL',
      postalCode: '60172',
    };

    address = await user.createAddress(data1);
    retrievedAddress = await Address.findOne({ where: { id: address.id } });
    expect(retrievedAddress).not.toBeNull();
  });

  it('should retrieve address', async () => {
    let addresses = await user.getAddresses();
    expect(addresses.length).toEqual(2);
    expect(addresses[0]!).toHaveProperty('addressLine1');
  });

  it('should update address', async () => {
    const data = {
      addressLine1: '1967 Orchid Road',
      city: 'Roselle',
      state: 'IL',
      postalCode: '60074',
    };

    const address = await user.createAddress(data);
    await address.update({ city: 'Rock Island' });

    const retrievedAddress = await Address.findOne({ where: { id: address.id } });
    expect(retrievedAddress!.city).toEqual('Rock Island');
  });

  it('should delete address', async () => {
    const data = {
      addressLine1: '1561 Coburn Hollow Road',
      city: 'Peoria',
      state: 'IL',
      postalCode: '61602',
    };

    const address = await Address.create(data);
    await address.destroy();

    const deletedAddress = await Address.findByPk(address.id);
    expect(deletedAddress).toBeNull();
  });

  it('should not delete User on address delete', async () => {
    const data = {
      addressLine1: '4921 Flinderation Road',
      city: 'Arlington Heights',
      state: 'IL',
      postalCode: '60005',
    };

    const address = await user.createAddress(data);
    await address!.destroy();

    expect(User.findByPk(user.id)).resolves.not.toBeNull();
  });

  it('should delete Address on User delete', async () => {
    const data = {
      addressLine1: '962 University Drive',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60605',
    };

    const address = await user.createAddress(data);

    await user.destroy();

    const retrievedAddress = await Address.findByPk(address.id);

    expect(retrievedAddress).toBeNull();
  });
});

describe('Token Model', () => {
  let user: User;

  beforeAll(async () => {
    user = await User.create({
      firstName: 'Jaque',
      lastName: 'Doe',
      email: 'jaquedoe@gmail.com',
      password: 'jackD0epa$$',
    });
  });

  it('should create token', async () => {
    let token = await Token.create({
      userId: user.id,
      type: 'verify',
      code: Token.generateCode(),
      expiresAt: Token.getExpiration(),
    });
    let retrievedToken = await Token.findOne({ where: { userId: user.id, type: 'verify' } });
    expect(retrievedToken).not.toBeNull();

    token = await Token.create({
      userId: user.id,
      type: 'password',
      code: Token.generateCode(),
      expiresAt: new Date(),
    });
    retrievedToken = await Token.findOne({ where: { userId: user.id, type: 'password' } });
    expect(retrievedToken).not.toBeNull();
  });

  it('should fail to create duplicate token', async () => {
    expect(
      Token.create({
        userId: user.id,
        type: 'verify',
        code: Token.generateCode(),
        expiresAt: Token.getExpiration(),
      }),
    ).rejects.toThrow();

    expect(
      Token.create({
        userId: user.id,
        type: 'password',
        code: Token.generateCode(),
        expiresAt: Token.getExpiration(),
      }),
    ).rejects.toThrow();
  });

  it('should retrieve token', async () => {
    const tokens = await user.getTokens();
    expect(tokens.length).toEqual(2);
  });

  it('should delete token', async () => {
    const token = await Token.findOne({ where: { userId: user.id, type: 'verify' } });
    await token!.destroy();

    const destroyedToken = await Token.findOne({ where: { userId: user.id, type: 'verify' } });
    expect(destroyedToken).toBeNull();
  });

  it('deleting Token should not delete User', async () => {
    const token = await Token.findOne({ where: { userId: user.id, type: 'password' } });
    await token!.destroy();

    const retrieveUser = await User.findByPk(user.id);
    expect(retrieveUser).not.toBeNull();
  });

  it('deleting User should delete Token', async () => {
    const token = await user.createToken({
      type: 'password',
      code: Token.generateCode(),
      expiresAt: Token.getExpiration(),
    });

    await user.destroy();

    const retrievedToken = await Token.findOne({ where: { userId: user.id, type: 'password' } });
    expect(retrievedToken).toBeNull();
  });

  it('should generate unique code', async () => {
    const code = Token.generateCode();
    expect(code.length).toBe(4);
    expect(parseInt(code)).toBeDefined();
  });
});
