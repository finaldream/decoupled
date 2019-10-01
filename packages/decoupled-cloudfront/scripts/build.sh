#!/usr/bin/env bash

CONFIG="tsconfig.json"

if [ "${NODE_ENV}" == "development" ]
then
    CONFIG="tsconfig.dev.json"
fi

echo "Building ${NODE_ENV:-"development"} with ${CONFIG}"
rm -rf dist/
tsc -p "${CONFIG}"
