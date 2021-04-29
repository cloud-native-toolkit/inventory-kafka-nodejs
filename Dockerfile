FROM node:14

WORKDIR /app

COPY package* .

RUN npm ci

COPY . /app

EXPOSE 3000

CMD [ "npm", "start" ]