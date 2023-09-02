import { NextFunction, Request, Response } from 'express';

const extractJWTFromCookie = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies['access-token'];

  if (token) req.headers.authorization = `Bearer ${token}`;

  next();
};

export default extractJWTFromCookie;
