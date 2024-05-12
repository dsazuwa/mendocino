FROM node:20-alpine3.17

ENV NODE_ENV=development

# set working directory
WORKDIR /usr/src/app

# copy package.json and package-lock.json
COPY package*.json ./

# install app dependencies
RUN npm install

# bundle source code inside the Docker image
COPY . .

# build TypeScript code
RUN npm run build

CMD ["npm", "run", "start"]