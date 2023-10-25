import { NextFunction, Request, Response } from 'express';

import modifierService from '@menu/services/modifier.service';

export const getModifier = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const result = await modifierService.getModifier(Number.parseInt(id, 10));

    if (!result) res.status(400).json({ message: 'Modifier not found' });

    res.status(200).json({ ...result });
  } catch (e) {
    next(e);
  }
};

export const getItemModifiers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const result = await modifierService.getItemModifiers(
      Number.parseInt(id, 10),
    );

    if (!result)
      res.status(400).json({ message: 'Menu Item Modifier not found' });

    res.status(200).json({ ...result });
  } catch (e) {
    next(e);
  }
};
