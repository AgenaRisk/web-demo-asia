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

APPLIED=$(kubectl apply -f demo-asia.yaml)
echo -e "$APPLIED"
if echo "$APPLIED" | grep -qe "deployment.*unchanged"; then
    kubectl -n public patch deployment demo-asia --patch '{"spec": {"template": {"metadata": {"labels": {"date": "'$(date +%s)'"}}}}}'
fi