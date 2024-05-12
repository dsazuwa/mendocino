import { config } from 'dotenv';
import { Sequelize } from 'sequelize';

import { logger } from './utils';

config();

const { NODE_ENV, TEST_DB_URL, DB_URL } = process.env;

const url = NODE_ENV === 'test' ? TEST_DB_URL : DB_URL;

let db: Sequelize;

try {
  db = new Sequelize(url, {
    dialect: 'postgres',
    benchmark: true,
    logging:
      NODE_ENV === 'production' || NODE_ENV === 'development'
        ? false
        : (query: string, timing: number | undefined) => {
            logger.debug(`SQL Query: ${query} Execution Time: ${timing} ms`);
          },
  });
} catch (error) {
  logger.error('Error on DB instantiation:', error);
  process.exit(1);
}

const sequelize = db;

export default sequelize;
