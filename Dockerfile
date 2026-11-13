FROM node:26.13.1-trixie

WORKDIR /code

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
