FROM node:14

WORKDIR /app

COPY . /app

RUN npm ci

EXPOSE 3000

CMD [ "npm", "start" ]