import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

const { NODE_ENV, DB_URL, TEST_DB_URL } = process.env;

const url = NODE_ENV === 'test' ? TEST_DB_URL : DB_URL;

const sequelize = new Sequelize(url as string, {
  benchmark: true,
  logging: (query, timing) => {
    console.log('SQL Query:', query, 'Execution Time:', timing, 'ms');
  },
});

export default sequelize;
