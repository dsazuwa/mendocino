import { config } from 'dotenv';
import { sign } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User, { UserRoleType, UserStatusType } from '../../src/models/User';
import '../utils/db-setup';
import sequelize from '../../src/db';

config();

describe('User Model', () => {
  it('should have this shape', () => {
    const expectedKeys = [
      'id',
      'uuid',
      'firstName',
      'lastName',
      'email',
      'password',
      'role',
      'status',
      'createdAt',
      'updatedAt',
    ].sort();
    const keys = Object.keys(User.getAttributes()).sort();
    expect(keys).toStrictEqual(expectedKeys);
  });

  it('should create user', async () => {
    const data = {
      uuid: uuidv4(),
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
    console.log(user.password, data.password);
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
