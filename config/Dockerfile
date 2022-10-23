FROM sitespeedio/node:ubuntu-18.04-nodejs10.15.3

ENV NODE_PORT 3000

COPY package.json .

RUN npm install

COPY sql/main.sql .
COPY app.js .
