FROM node:20-alpine

# Install dependencies for building native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
