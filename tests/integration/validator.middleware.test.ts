import '../utils/db-setup';
import { request } from '../utils/supertest.helper';

describe('Validator Middleware', () => {
  const BASE_URL = '/api/auth';
  it('should pass validation for valid registration data', async () => {
    const data = {
      firstName: 'Jess',
      lastName: 'Doe',
      email: 'jessdoe@gmail.com',
      password: 'jessD0ePas$$',
    };

    await request.post(`${BASE_URL}/register`).send(data).expect(200);
  });

  it('should fail validation for invalid registration data', async () => {
    const data = {
      firstName: '',
      lastName: '',
      email: 'jessdoe',
      password: 'jessdoe',
    };

    await request.post(`${BASE_URL}/register`).send(data).expect(400);
  });

  it('should pass validation for valid login data', async () => {
    const data = {
      email: 'jessdoe@gmail.com',
      password: 'jessD0ePas$$',
    };

    await request.post(`${BASE_URL}/login`).send(data).expect(200);
  });

  it('should fail validation for invalid login data', async () => {
    const data = {
      email: 'jessdoegmail.com',
      password: '',
    };

    await request.post(`${BASE_URL}/login`).send(data).expect(400);
  });
});
