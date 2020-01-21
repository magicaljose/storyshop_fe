FROM node:10.15.1

WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY public/ ./public
COPY src/ ./src
COPY .env ./.env
ENV NODE_OPTIONS=--max_old_space_size=8192
RUN npm run build
CMD [ "npm", "start" ]
