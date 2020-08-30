FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./


# Install the MongoDB shell
# Instructions followed are here https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/
RUN apt-get update
RUN apt-get -y install build-essential && apt-get -y install gnupg && apt-get -y install python3
RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
RUN echo "deb http://repo.mongodb.org/apt/debian stretch/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
RUN apt-get update && apt-get install -y mongodb-org-shell=4.4.0

# Copy replica set waiter script
COPY waitForReplicaSet.sh ./waitForReplicaSet
RUN chmod +x ./waitForReplicaSet


RUN npm install
COPY . .
EXPOSE 500
CMD ./waitForReplicaSet && npm run start:dev

#CMD [ "npm", "run", "start:dev" ]
