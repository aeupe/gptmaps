FROM node:16-alpine
WORKDIR /src
EXPOSE 8080
COPY package*.json ./
RUN npm install
COPY . ./
CMD ["npm", "start"]