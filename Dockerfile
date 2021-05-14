FROM node:14

WORKDIR /app/

COPY package* ./

RUN npm ci

COPY --chown=root:0 . /app/
RUN chmod -R g=u .

EXPOSE 3000

ARG ENV=production
ENV NODE_ENV $ENV
ENV NODE_VERSION $NODEJS_VERSION
CMD npm run $NODE_ENV