FROM node:8.11

MAINTAINER Niraj Georgian nirajgeorgian@gmail.com

# Make folder for project backend and attach your backend
RUN mkdir -p /OoOO/server
WORKDIR /OoOO/server

# Install the dependencies because node_modules folder change
# and we don't want to execute npm install every time
COPY ./package*.json /OoOO/server/
RUN npm install

# Now copy entire folder
COPY . /OoOO/server/

CMD ["npm", "run", "start"]