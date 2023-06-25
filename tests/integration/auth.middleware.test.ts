import { User } from '../../src/models';
import '../utils/db-setup';
import { request } from '../utils/supertest.helper';

describe('Authentication Middleware', () => {
  it('should authenticate the request with a valid access token', async () => {
    const user = await User.create({
      firstName: 'Jess',
      lastName: 'Doe',
      email: 'jessdoe@gmail.com',
      password: 'jessD0ePas$$',
    });

    const token = user.generateJWT();

    await request.get('/api/users/me').auth(token, { type: 'bearer' }).expect(200);
  });

  it('should return 401 Unauthorized for an invalid access token', async () => {
    await request.get('/api/users/me').auth('badtoken', { type: 'bearer' }).expect(401);

    await request.get('/api/users/me').expect(401);
  });

  it('should return 401 Unauthorized for a deactivated account', async () => {
    const user = await User.create({
      firstName: 'Jessica',
      lastName: 'Doe',
      email: 'jessicadoe@gmail.com',
      password: 'jessD0ePs$$',
      status: 'inactive',
    });

    const token = user.generateJWT();

    await request.get('/api/users/me').auth(token, { type: 'bearer' }).expect(401);
  });
});

describe('PermitOnlyPendingUsers middleware', () => {
  let user: User;
  let token: string;

  beforeAll(async () => {
    user = await User.create({
      firstName: 'Janice',
      lastName: 'Doe',
      email: 'janicedoe@gmail.com',
      password: 'janiceD0ePa$$',
    });

    token = user.generateJWT();
  });

  it('should permit access for active user', async () => {
    await request.post('/api/users/me/verify').auth(token, { type: 'bearer' }).expect(200);
  });

  it('should block access from non-pending user', async () => {
    await user.update({ status: 'active' });
    await request.post('/api/users/me/verify').auth(token, { type: 'bearer' }).expect(401);

    await user.update({ status: 'inactive' });
    await request.post('/api/users/me/verify').auth(token, { type: 'bearer' }).expect(401);
  });
});
