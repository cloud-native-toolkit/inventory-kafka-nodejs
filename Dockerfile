FROM node:14

COPY /src /src

COPY server.js .

COPY package.json .

EXPOSE 3000

RUN npm install

CMD [ "npm", "start" ]