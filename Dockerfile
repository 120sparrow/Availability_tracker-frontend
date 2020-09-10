FROM node:12-alpine

MAINTAINER Eugen Buranov

WORKDIR /
ADD package.json /
RUN npm install --no-progress && rm -rf /root/.npm /tmp/npm*
RUN npm install -g --no-progress @vue/cli-service
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/latest-stable/community' >> /etc/apk/repositories
RUN apk update
RUN apk add docker-cli
