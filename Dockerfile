FROM node:16

WORKDIR /course

COPY package.json tsconfig.json ./

RUN npm i

EXPOSE 5200

CMD npm run start:dev