FOUNDRY_USERNAME=$1
FOUNDRY_PASSWORD=$2
FOUNDRY_VERSION=$3

if [ -z "${FOUNDRY_VERSION}" ]; then
  FOUNDRY_VERSION=latest
fi;

docker stop "FoundryVTT" && docker rm "FoundryVTT"

docker pull felddy/foundryvtt:${FOUNDRY_VERSION}

docker run \
  -d \
  --env FOUNDRY_USERNAME="${FOUNDRY_USERNAME}" \
  --env FOUNDRY_PASSWORD="${FOUNDRY_PASSWORD}"\
  --env CONTAINER_PRESERVE_CONFIG="true"\
  --publish 30000:30000/tcp \
  --volume ~/FoundryData_${FOUNDRY_VERSION}:/data \
  --volume "$(pwd)":/data/Data/systems/custom-system-builder \
  --name "FoundryVTT" \
  felddy/foundryvtt:${FOUNDRY_VERSION}


docker logs -f "FoundryVTT" 2>&1 | grep -m 1 "Server started and listening on port 30000"

echo "Resetting file rights"
sudo chown -R $USER: $(pwd)

echo "Running at http://localhost:30000"
