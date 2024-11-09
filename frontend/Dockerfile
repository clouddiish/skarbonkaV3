FROM node:22.11.0-alpine3.19
WORKDIR /frontend
COPY package.json /frontend
COPY package-lock.json /frontend
RUN npm install
COPY public /frontend/public
COPY src /frontend/src 
EXPOSE 3000
CMD ["npm", "start"]