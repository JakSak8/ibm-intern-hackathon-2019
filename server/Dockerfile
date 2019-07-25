FROM node:8

WORKDIR /server

COPY package*.json ./

RUN npm install

RUN npm audit fix

COPY . .

ENV PORT 8080

EXPOSE 8080

CMD ["npm", "start"]