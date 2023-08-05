declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;

      API_PORT: string;

      DB_USER: string;
      DB_PASSWORD: string;

      DEV_DB_NAME: string;
      DEV_DB_HOST_PORT: string;
      DEV_DB_CONTAINER_PORT: string;

      TEST_DB_NAME: string;
      TEST_DB_HOST_PORT: string;
      TEST_DB_CONTAINER_PORT: string;

      DB_URL: string;
      TEST_DB_URL: string;

      JWT_SECRET: string;
    }
  }
}

export {};
