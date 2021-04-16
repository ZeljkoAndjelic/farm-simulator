FROM node:14-alpine AS development

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

FROM node:14-alpine AS production 
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG PORT=3000
ENV PORT=${PORT}

ENV MYSQL_HOST=${MYSQL_HOST}
ENV MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
ENV MYSQL_DATABASE=${MYSQL_DATABASE}}
ENV MYSQL_USER=${MYSQL_USER}
ENV MYSQL_PASSWORD=${MYSQL_PASSWORD}

WORKDIR /usr/src/app
RUN npm install --global pm2

COPY package*.json yarn.lock ./
RUN yarn install --production --frozen-lockfile --silent

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE ${PORT}

CMD [ "node", "dist/main.js" ]


