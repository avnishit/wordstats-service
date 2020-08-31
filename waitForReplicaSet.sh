  
#!/bin/sh
# Set up mongo replica set & choose master
# exit when any command fails
set -e

if [ -z "${MONGO_URI}" ]; then
  echo "MONGO_URI is not defined"
  exit 1
fi

MONGO_HOST="$(echo "${MONGO_URI}" | sed -n 's/^mongodb:\/\/\(.*\)\/?replSet=.*$/\1/p')"

if [ -z "${MONGO_HOST}" ]; then
  echo "MONGO_URI format is invalid"
  exit 1
fi

echo "MONGO_HOST is ${MONGO_HOST}"

rsStatus="0"

while [ "${rsStatus}" != "1" ]
do
  echo "Checking replica set status..."

  sleep 1

  rsStatus=$(mongo --host "${MONGO_HOST}" --quiet --eval="rs.status().ok || rs.initiate().ok")

  rsStatus="$(echo "${rsStatus}" | sed 's/[[:space:]]//g')"
done

echo "Replica set initiated!"

isMaster="false"

while [ "${isMaster}" != "true" ]
do
  echo "Checking if mongo node is master..."

  sleep 1

  isMaster=$(mongo --host "${MONGO_HOST}" --quiet --eval="db.runCommand({isMaster: 1}).ismaster")

  isMaster="$(echo "${isMaster}" | sed 's/[[:space:]]//g')"
done

echo "Mongo node is a master node!"
