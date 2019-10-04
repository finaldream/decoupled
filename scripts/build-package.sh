#!/usr/bin/env bash

function help {
    echo "This script needs to be run in a package!"
    exit 1;
}

CONFIG="tsconfig.json"
ROOT_DIR=`pwd`
PARENT_DIR="$(basename $(dirname ${ROOT_DIR}))"

if [ "${PARENT_DIR}" != "packages" ]; then
    help
fi;

# if [ "${NODE_ENV}" == "development" ]
# then
#     CONFIG="tsconfig.dev.json"
# fi

echo "Building ${NODE_ENV:-"development"} with ${CONFIG}"
echo "RootDir: ${ROOT_DIR}"
rm -rf lib/
tsc -p "${CONFIG}"
