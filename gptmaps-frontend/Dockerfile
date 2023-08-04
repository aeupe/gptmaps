FROM node:16-alpine
ARG REACT_APP_GPTMAPS_API_URL
WORKDIR /src
EXPOSE 3000
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build
CMD ["npm", "start"]