# Stage 1: Build the application
FROM node:20 AS build

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./
COPY package-lock.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Define build arguments and set environment variables for the build stage
ARG MONGODB_URI
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_OPENAI_API_KEY

# Set environment variables
ENV MONGODB_URI=${MONGODB_URI}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=${NEXT_PUBLIC_GOOGLE_CLIENT_SECRET}
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
ENV NEXT_PUBLIC_OPENAI_API_KEY=${NEXT_PUBLIC_OPENAI_API_KEY}

# Build your Next.js app
RUN npm run build

# Stage 2: Create the runtime image
FROM node:20

# Set environment variables
ENV NODE_ENV=production
ENV MONGODB_URI=${MONGODB_URI}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=${NEXT_PUBLIC_GOOGLE_CLIENT_SECRET}
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
ENV NEXT_PUBLIC_OPENAI_API_KEY=${NEXT_PUBLIC_OPENAI_API_KEY}

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy built assets from the build stage
COPY --from=build /usr/src/app ./

# Install only production dependencies
RUN npm ci --production

EXPOSE 3000

# Run the web service on container startup.
CMD [ "npm", "start" ]
