import sequelize from '../../src/db';

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

});

afterAll(async () => {
  await sequelize.close();
});
