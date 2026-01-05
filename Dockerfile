# Use Node 18
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy server package files
# We copy from the server/ directory in the repo to the current /app directory
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server code
COPY server/ .

# Expose port 7860 (Required by Hugging Face Spaces)
EXPOSE 7860

# Force the application to listen on 7860
ENV PORT=7860

# Start command
CMD ["node", "src/index.js"]
