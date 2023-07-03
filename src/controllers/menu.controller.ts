import { NextFunction, Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import sequelize from '../db';

const getMenuQuery = `
  SELECT
    m.id, m.name, m.description, m.category, m.status, m.price, m.photo_url, 
    ARRAY_AGG(t.name) AS tags
  FROM
    menu AS m
    LEFT JOIN menu_menu_tags AS mmt ON m.id = mmt.menu_id
    LEFT JOIN menu_tags AS t ON mmt.menu_tag_id = t.id
  GROUP BY
    m.id
  ORDER BY category`;

export const getMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menuItems = await sequelize.query(getMenuQuery, { type: QueryTypes.SELECT });

    res.status(200).json({ menu: menuItems, message: 'Retrieved all Menu Items' });
  } catch (e) {
    next(e);
  }
};

export const getMenuGroupedBy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const field = req.query.by as string;

    const query =
      field === 'tag'
        ? `
          SELECT
            t.name AS tag,
            ARRAY_AGG(
              JSONB_BUILD_OBJECT(
                'id', m.id,
                'name', m.name,
                'description', m.description,
                'category', m.category,
                'status', m.status,
                'price', m.price
              )
            ) AS items
          FROM
            menu AS m
            LEFT JOIN menu_menu_tags AS mmt ON m.id = mmt.menu_id
            LEFT JOIN menu_tags AS t ON mmt.menu_tag_id = t.id
          GROUP BY
            t.name`
        : `
          SELECT 
            ${field}, 
            JSONB_AGG(jsonb_build_object(
              'id', id, 'name', name, 'description', description, 'category', category,
              'status', status,'photo_url', photo_url, 'price', price, 'tags', tags 
            )) AS items
          FROM (${getMenuQuery}) as menu
          GROUP BY ${field}`;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    res.status(200).json({ menu: result, message: `Retrieved Menu Items grouped by ${field}` });
  } catch (e) {
    next(e);
  }
};
