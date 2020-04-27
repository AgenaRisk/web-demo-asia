#!/bin/bash

BASEDIR=$(dirname "$0")

cd $BASEDIR

registry="agenacr"

az acr login --name $registry

image="$registry.azurecr.io/wapps-demo-asia"

version='0.4'
yarn build

mvn clean install

docker build --force-rm=true -t "$image:$version" -t "$image:latest" .
docker push "$image:$version"
docker push "$image:latest"

kubectl patch deployment demo-asia --patch '{"spec": {"template": {"metadata": {"labels": {"date": "'$(date +%s)'"}}}}}'