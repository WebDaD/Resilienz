FROM node:argon

# Create app directory
RUN mkdir -p /opt/resilienz-app
WORKDIR /opt/resilienz-app

# Copy app
COPY . /opt/resilienz-app

# Install and Deploy
RUN npm install
RUN npm run createui
RUN npm run minifyui

# Expose Web Port and Set Start Command
EXPOSE 8080
CMD ["npm", "start"]
