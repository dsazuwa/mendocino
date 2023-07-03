# spoons-api

Spoons API is a RESTful API for food ordering.

## Prerequisites

Before running the Spoons API, ensure you have the following installed:

- Node.js (version 20.3.1)
- PostgreSQL (version 12.15)

## Getting Started

Follow the steps below to get the Spoons API up and running:

1. Clone the repository:

   ```shell
   git clone https://github.com/dsazuwa/spoons-api.git

2. Install dependencies:

   ```shell
   cd spoons-api
   npm install
   npm run prepare

3. Configure the environment variables:
   * Create a `.env` file based on the provided `.env.example` file
   * Update the variables with the appropriate values

4. Set up the database:
   * Start the database containers
     
     ```shell
     docker-compose up -d
     
   * Start the `psql` interactive terminal

     ```shell
     psql -h <hostname> -p <port> -U <username> -d <database>     

5. Run the database scripts:
   
   ```shell
   \i <path-to>/spoons-api/db/menu.sql
   \i <path-to>/spoons-api/db/users.sql
   \i <path-to>/spoons-api/db/orders.sql

6. Start the server

   ```shell
   npm run build
   npm start

7. The Spoons API should now be running at `http://localhost:<PORT>`.

## API Documentation
For detailed information about the available API endpoints, please refer to the [API Documentation](https://documenter.getpostman.com/view/19231873/2s93z86NgN).

## Testing
Ensure that the test database container is running. Then run the test by executing the following command:

   ```shell
   npm run test