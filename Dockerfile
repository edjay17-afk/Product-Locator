FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Create directory for SQLite persistent database storage
RUN mkdir -p db

# Environment variables
ENV PORT=3002
ENV NODE_ENV=production

EXPOSE 3002

CMD ["npm", "start"]
