import { NextFunction, Request, Response } from 'express';

import { messages } from '../utils.ts/messages';

export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // const menu = await itemsService.getMenuItems();

    res.status(200);
    // .json({ menu, message: messages.GET_MENU });
  } catch (e) {
    next(e);
  }
};

export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // const { name, description, category, tags, prices, photoUrl, status } =
    //   req.body;

    // const itemId = await itemsService.createItem(
    //   name,
    //   description,
    //   category,
    //   tags,
    //   prices,
    //   photoUrl,
    //   status,
    // );

    res.status(200);
    // .json({ message: `New menu item #${itemId} created` });
  } catch (e) {
    next(e);
  }
};

export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // const { id } = req.params;
    // const { name, description, category, photoUrl, status } = req.body;

    // await itemsService.updateItem(
    //   parseInt(id, 10),
    //   name,
    //   description,
    //   category,
    //   photoUrl,
    //   status,
    // );

    res.status(200).json({ message: messages.UPDATE_ITEM });
  } catch (e) {
    next(e);
  }
};

export const updateItemStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // const { id } = req.params;
    // const { status } = req.body;

    // const result = await itemsService.updateItemStatus(
    //   parseInt(id, 10),
    //   status,
    // );

    // if (result)
    //   return res.status(200).json({ message: messages.UPDATE_ITEM_STATUS });

    res.status(400).json({ message: messages.UPDATE_ITEM_STATUS_FAIL });
  } catch (e) {
    next(e);
  }
};

export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO: add condition to only delete if there are no current or previous orders associated with menu item
    // const { id } = req.params;

    // const result = await itemsService.deleteItem(parseInt(id, 10));

    // if (result) return res.status(200).json({ message: messages.DELETE_ITEM });

    res.status(400).json({ message: messages.DELETE_ITEM_FAIL });
  } catch (e) {
    next(e);
  }
};
