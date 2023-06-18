import { request } from "../utils/supertest.helper";

describe('server', () => {
  it('should return this message', async () => {
    await request
      .get('/')
      .expect(200)
      .then(response => {
        expect(response.body.message).toBe("Welcome to Spoons API.");
      });
  });
});