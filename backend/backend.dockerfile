FROM node:20.11.0

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install


COPY . .

EXPOSE 4000
RUN node init-db.js

CMD [ "node", "index.js" ] 