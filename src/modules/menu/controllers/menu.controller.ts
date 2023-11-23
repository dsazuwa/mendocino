import { NextFunction, Request, Response } from 'express';

import menuService from '../services/menu.service';
import { messages } from '../utils.ts/messages';

export const getMenu = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const menu = await menuService.getMenu();

    res.status(200).json({ menu, message: messages.GET_MENU });
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
    const menu = await menuService.getGroupedMenu();

    res.status(200).json({ ...menu, message: messages.GET_MENU });
  } catch (e) {
    next(e);
  }
};

export const getOrderMenu = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const menu = await menuService.getOrderMenu();

    res.status(200).json({ menu, message: messages.GET_MENU });
  } catch (e) {
    next(e);
  }
};
