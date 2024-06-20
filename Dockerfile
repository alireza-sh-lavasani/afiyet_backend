#*************************************
#******** Build Stage
#*************************************
# Build image
FROM node:lts as builder

# Create and set the working directory
WORKDIR /app

# Copy .npmrc file to authenticate with Azure DevOps
COPY .npmrc ./

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Build the project
RUN yarn build

#*************************************
#******** Deploy Stage
#*************************************
FROM node:lts-alpine as deployment

# Create and set the working directory
WORKDIR /app

# Copy node modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy the build artifact to the dist folder
COPY --from=builder /app/dist ./dist

# Start the server using the deployment build
CMD [ "node", "dist/main.js" ]