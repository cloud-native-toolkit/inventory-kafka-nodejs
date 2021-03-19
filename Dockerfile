FROM node:14

COPY package*.json .

RUN npm ci

COPY /src /src

COPY server.js .

EXPOSE 3000

CMD [ "npm", "start" ]