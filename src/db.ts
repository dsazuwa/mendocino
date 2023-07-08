import { config } from 'dotenv';
import { Sequelize } from 'sequelize';
import { errorHandler } from './utils';
import logger from './utils/Logger';

config();

const { NODE_ENV, DB_URL, TEST_DB_URL } = process.env;

const url = NODE_ENV === 'test' ? TEST_DB_URL : DB_URL;

let sequelize: Sequelize;

try {
  sequelize = new Sequelize(url as string, {
    benchmark: true,
    logging:
      process.env.NODE_ENV === 'production'
        ? false
        : (query: string, timing: number | undefined) => {
            logger.debug(`SQL Query: ${query} Execution Time: ${timing} ms`);
          },
  });
} catch (e) {
  errorHandler.handleError(e, 'Error on DB instantiation:');
  process.exit(1);
}

export default sequelize;
