import { NextFunction, Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import sequelize from '../db';
import { Menu } from '../models';

export const getMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menuItems = await Menu.findAll({
      attributes: ['id', 'name', 'description', 'category', 'status', 'price'],
    });

    res.status(200).json({ menu: menuItems, message: 'Retrieved all Menu Items' });
  } catch (e) {
    next(e);
  }
};

export const getMenuGroupedBy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const field = req.query.by as string;

    const query = `
      SELECT ${field}, JSONB_AGG(jsonb_build_object('id', id, 'name', name, 'description', description, 'category', category, 'status', status,'photo_url', photo_url, 'price', price )) AS items
      FROM menu
      GROUP BY ${field}
    `;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    res.status(200).json({ menu: result, message: `Retrieved Menu Items grouped by ${field}` });
  } catch (e) {
    next(e);
  }
};
