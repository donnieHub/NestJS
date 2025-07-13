FROM node:22.16.0-alpine3.22

RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

COPY package*.json ./
COPY ./apps/user/tsconfig.app.json ./apps/user/

RUN yarn install --frozen-lockfile && yarn cache clean

COPY . .
RUN yarn build

CMD ["yarn", "start:dev", "user"]