#!/usr/bin/env bash

set -e

if [ $(which apk &> /dev/null) ]; then
  apk add jq
fi

dirs=$(find packages -name Dockerfile | xargs dirname)

if [ $1 ]; then
  dirs="$1"
fi

registry=eu.gcr.io
env=$PROJECT_ENVIRONMENT

echo "ENVIRONMENT $env"

for dir in $dirs; do
  cd $dir

  name=$(cat package.json | jq ".name" | xargs echo)
  version=$(git rev-parse HEAD)

  if [[ "${env}" == "" ]]; then
    env=unbound
  fi

  if [[ "${env}" == "production" ]]; then
    version=$(cat package.json | jq ".version" | xargs echo)
  fi

  project_name="${name}"
  image_name="${registry}/${GCP_PROJECT}/${project_name}:${version}"

  echo $image_name

  if [[ "$GCP_CREDENTIALS" != "" ]]; then
    GOOGLE_APPLICATION_CREDENTIALS=$(realpath ./terraform-credentials.json)
    echo "$GCP_CREDENTIALS" > $GOOGLE_APPLICATION_CREDENTIALS

    gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
    gcloud auth configure-docker --quiet
  fi

  docker build -t $image_name .

  if [[ "$env" != "" ]]; then
    docker push ${image_name}
  fi
done

set +x
