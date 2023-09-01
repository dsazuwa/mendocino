import { Request, Response, NextFunction } from 'express';

import menuService from '@menu/services/menu.service';
import { messages } from '@menu/utils.ts/messages';

export const getMenu = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const menu = await menuService.getMenu();

    if (!menu) return res.status(500).json({ message: messages.GET_MENU_FAIL });

    res.status(200).json({ menu, message: messages.GET_MENU_SUCCESS });
  } catch (e) {
    next(e);
  }
};

export const getMenuGrouped = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const menu = await menuService.getMenuGroupedByCategory();

    if (!menu) return res.status(500).json({ message: messages.GET_MENU_FAIL });

    res.status(200).json({ menu, message: messages.GET_MENU_SUCCESS });
  } catch (e) {
    next(e);
  }
};
