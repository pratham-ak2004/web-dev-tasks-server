# Use the official Node.js 14 image as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or pnpm-lock.yaml in your case) to the working directory
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy the rest of your application's code
COPY . .

# start app
ENTRYPOINT ["pnpm", "start"]

# Your application binds to port 3000, so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
# CMD [ "pnpm", "start" ]