import { Request, Response } from 'express';

import { permitPending } from '@user/middleware/route-guards';

describe('Permit Pending Guard', () => {
  it('should permit access to pending user', () => {
    const req = {
      user: { userId: 1, status: 'pending' },
    } as unknown as Request;

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    permitPending(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should deny access to active user', () => {
    const req = {
      user: { userId: 1, status: 'active' },
    } as unknown as Request;

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    permitPending(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should deny access to deactivated user', () => {
    const req = {
      user: { userId: 1, status: 'deactivated' },
    } as unknown as Request;

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    permitPending(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
