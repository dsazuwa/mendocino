import { Request, Response } from 'express';

import { redirectToApiOnRootGet } from '../../src/middleware';
import { request } from '../supertest.helper';

describe('Redirect Middleware', () => {
  it('should redirect get / to get /api', async () => {
    const response = await request.get('/');

    expect(response.status).toBe(301);
    expect(response.header.location).toBe('/api');
  });

  it('should not call next for other requests', () => {
    const req = {
      method: 'GET',
      path: '/some-other-path',
    } as unknown as Request;
    const res = { redirect: jest.fn() } as unknown as Response;
    const next = jest.fn();

    redirectToApiOnRootGet(req, res, next);

    expect(res.redirect).not.toHaveBeenCalled();
  });
});
