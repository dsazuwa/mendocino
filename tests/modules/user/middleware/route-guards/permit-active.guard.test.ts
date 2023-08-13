import { Request, Response } from 'express';

import { permitActive } from '@user/middleware/route-guards';

describe('Permit Active Guard', () => {
  it('should permit access to active user', () => {
    const req = {
      user: { id: 1, status: 'active' },
    } as unknown as Request;

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    permitActive(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should deny access to pending user', () => {
    const req = {
      user: { id: 1, status: 'pending' },
    } as unknown as Request;

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    permitActive(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should deny access to inactive user', () => {
    const req = {
      user: { id: 1, status: 'inactive' },
    } as unknown as Request;

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    permitActive(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
