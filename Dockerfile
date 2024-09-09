FROM node:20.10.0-alpine
WORKDIR /app
COPY package*.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
COPY .env ./
EXPOSE 5000
RUN npm run build
CMD ["npm","start" ]
