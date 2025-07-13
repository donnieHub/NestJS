FROM node:22.16.0-alpine3.22

RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

COPY package*.json ./
COPY ./apps/r-omni/tsconfig.app.json ./apps/r-omni/

RUN yarn install --frozen-lockfile && yarn cache clean

COPY . .
RUN yarn build

EXPOSE 3001

CMD ["yarn", "start:dev", "r-omni"]