import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import logger from './utils/Logger';

config();

const { NODE_ENV, DB_URL, TEST_DB_URL } = process.env;

const url = NODE_ENV === 'test' ? TEST_DB_URL : DB_URL;

if (!url) {
  const err = new Error('Database URL is not defined');
  logger.error('Setup Error:', err);
  process.exit(1);
}

const sequelize = new Sequelize(url as string, {
  benchmark: true,
  logging:
    process.env.NODE_ENV === 'production'
      ? false
      : (query: string, timing: number | undefined) => {
          logger.debug(`SQL Query: ${query} Execution Time: ${timing} ms`);
        },
});

export default sequelize;
