FROM node:10-alpine
RUN mkdir -p /opt/app/ll-admin
WORKDIR /opt/app/ll-admin
COPY package*.json /opt/app/ll-admin/
RUN npm install --quiet
