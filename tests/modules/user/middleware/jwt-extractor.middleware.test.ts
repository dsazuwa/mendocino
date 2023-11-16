import { Request, Response } from 'express';

import { extractJwtFromCookie } from 'modules/user';

describe('extractJwtFromCookie Middleware', () => {
  const res = {} as unknown as Response;

  it('should set Authorization header from access-token cookie', () => {
    const req = {
      cookies: { 'access-token': 'your-access-token' },
      headers: { authorization: '' },
    } as unknown as Request;

    const next = jest.fn();

    extractJwtFromCookie(req, res, next);

    expect(req.headers.authorization).toEqual('Bearer your-access-token');
    expect(next).toHaveBeenCalled();
  });

  it('should not set Authorization header if access-token cookie is missing', () => {
    const req = {
      cookies: {},
      headers: { authorization: '' },
    } as unknown as Request;

    const next = jest.fn();

    extractJwtFromCookie(req, res, next);

    expect(req.headers.authorization).toBe('');
    expect(next).toHaveBeenCalled();
  });
});
