FROM --platform=linux/amd64 node:22-alpine as builder

WORKDIR /home/node/app

COPY ./services/server/package.json ./package.json
COPY ./services/server/package-lock.json ./package-lock.json

RUN npm ci --loglevel verbose

COPY ./services/server/src ./src
COPY ./services/server/tsconfig.json ./tsconfig.json

RUN npm run build

FROM --platform=linux/amd64 node:22-alpine

WORKDIR /home/node/app

COPY --from=builder /home/node/app /home/node/app

EXPOSE 4356

CMD ["node", "build/index.js"]
