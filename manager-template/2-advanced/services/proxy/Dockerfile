ARG BUILD_ENV

FROM --platform=linux/amd64 nginx:alpine as build_prod

ONBUILD COPY ./services/proxy/conf/prod.nginx.conf /etc/nginx/conf.d/default.conf

FROM --platform=linux/amd64 nginx:alpine as build_dev

ONBUILD COPY ./services/proxy/conf/dev.nginx.conf /etc/nginx/conf.d/default.conf

FROM --platform=linux/amd64 build_${BUILD_ENV}

COPY ./services/proxy/index.html /usr/share/nginx/html

EXPOSE 8080
