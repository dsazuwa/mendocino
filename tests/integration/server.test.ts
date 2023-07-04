import { request } from '../utils/supertest.helper';

describe('server', () => {
  it('should return this message', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Welcome to Spoons API.');
  });
});
