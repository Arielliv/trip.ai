# Stage 1: Build the application
FROM node:20 AS build

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Build your Next.js app
RUN npm run build

# Stage 2: Create the runtime image
FROM node:20

# Set environment variables
ENV MONGODB_URI=${MONGODB_URI}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXT_AUTH_URL=${NEXT_AUTH_URL}
ENV MONGODB_URI=${MONGODB_URI}
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy built assets from the build stage
COPY --from=build /usr/src/app ./

# Install only production dependencies
RUN npm ci --production

EXPOSE 3000

# Run the web service on container startup.
CMD [ "npm", "start" ]
