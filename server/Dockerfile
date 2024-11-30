FROM node:14-alpine

WORKDIR /usr/api

COPY --chown=node:node package*.json ./

RUN npm install && npm cache clean --force

COPY . .

RUN npm run build

EXPOSE 3333

ENTRYPOINT ["sh", "/usr/api/entrypoint.sh"]
