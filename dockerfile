FROM node:15.8

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .

EXPOSE 3000
CMD [ "node", "src/app.js" ]