# /server/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package management files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Backend server port (adjust if your Express app uses another port)
EXPOSE 5000

# Start backend server
CMD ["npm", "start"]