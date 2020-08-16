#!/bin/bash

BASEDIR=$(dirname "$0")
cd $BASEDIR

product="wapps-demo-asia"

registry="agenacr"
image="$registry.azurecr.io/$product"
version=$(cat package.json | jq -r '.version')

rm -rf build
yarn build

#--force-rm=true --no-cache
docker build -t "$image:$version" -t "$image:latest" .

az acr login --name $registry
docker push "$image:$version"
docker push "$image:latest"

yq w -d1 demo-asia-prod-template.yaml "spec.template.spec.containers[0].image" "$image:$version" > demo-asia.yaml
