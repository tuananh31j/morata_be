FROM node:20.10.0-alpine
WORKDIR /app
COPY package*.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm","start" ]
