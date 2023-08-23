import { NextFunction, Request, Response } from 'express';

import userService from '@user/services/user.service';
import messages from '@user/utils/messages';

export const getUserData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userService.getUserDataFromReq(req);

    if (!user) return res.status(401).json({ message: messages.GET_USER_FAIL });

    res.status(200).json({ user });
  } catch (e) {
    next(e);
  }
};
