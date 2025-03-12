FROM --platform=linux/amd64 node:22-alpine as builder

WORKDIR /home/node/app

COPY ./services/admin/package.json ./package.json
COPY ./services/admin/package-lock.json ./package-lock.json

RUN npm install

COPY ./services/admin/src ./src
COPY ./services/admin/tsconfig.json ./tsconfig.json
COPY ./services/admin/index.html ./index.html
COPY ./services/admin/vite.config.ts ./vite.config.ts

RUN npm run build

FROM --platform=linux/amd64 nginx

COPY --from=builder /home/node/app/build /usr/share/nginx/html

COPY ./services/admin/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
