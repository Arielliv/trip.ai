# Use the official lightweight Node.js 16 image.
# https://hub.docker.com/_/node
FROM node:20

ENV MONGODB_URI=${MONGODB_URI}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXT_AUTH_URL=${NEXT_AUTH_URL}

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install --production=false

# Copy local code to the container image.
COPY . .

# Build your Next.js app
RUN npm run build

RUN npm ci

EXPOSE 3000
# Run the web service on container startup.
CMD [ "npm", "start" ]
