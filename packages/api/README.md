# mendocino-api

Mendocino API is a RESTful API for food ordering.

## Prerequisites

Before running the Mendocino API, ensure you have the following installed:

- Node.js (version 20.3.1)
- PostgreSQL (version 12.15)

## Getting Started

Follow the steps below to get the Mendocino API up and running:

1. Clone the repository:

   ```shell
   git clone https://github.com/dsazuwa/mendocino.git

2. Install dependencies:

   ```shell
   cd mendocino
   npm install
   npm run prepare

3. Configure the environment variables:
   * Create a `.env` file based on the provided `.env.example` file
   * Update the variables with the appropriate values

4. Run the application
     
     ```shell
     docker-compose up -d 

5. The Mendocino API should now be running at `http://localhost:<PORT>`.

## API Documentation
For detailed information about the available API endpoints, please refer to the [API Documentation](https://documenter.getpostman.com/view/19231873/2s93z86NgN).

## Testing
Ensure that the test database container is running. Then run the test by executing the following command:

   ```shell
   npm run test
