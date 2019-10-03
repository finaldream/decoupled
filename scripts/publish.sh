#!/usr/bin/env bash

if [ "${1}" == "" ]
then
    echo "Please provide a package or scope!"
    exit 1
fi

OLD_DIR=`pwd`

if ! cd "packages/${1}"; then
    echo "Unknown package ${1}"
    exit 1
fi

if ! git diff-index --quiet HEAD --; then
    echo "You have staged changes, please commit first."
    exit 1
fi

VER=$(node -pe "var {name, version}=require('./package.json'); name + '@' + version")

test -z "$(npm info ${VER})"
if [ $? -ne 0 ]; then
    echo "$VER already is published!"
    exit 1
fi

echo "Prepublish tests"

yarn test
yarn lint

echo "Publishing $VER"
yarn build
npm publish

cd "${OLD_DIR}"
