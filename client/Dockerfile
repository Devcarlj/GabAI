# /client/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package management files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Vite dev server default port
EXPOSE 5173

# Start Vite dev server with host flag exposed for Docker
CMD ["npm", "run", "dev", "--", "--host"]