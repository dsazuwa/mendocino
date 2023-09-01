import { NextFunction, Request, Response } from 'express';

import itemsService from '@menu/services/items.service';
import { messages } from '@menu/utils.ts/messages';

export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const menu = await itemsService.getMenuItems();

    res.status(200).json({ menu, message: messages.GET_MENU });
  } catch (e) {
    next(e);
  }
};
