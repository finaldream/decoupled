#!/usr/bin/env bash

if [ "${1}" == "" ]
then
    echo "Please provide a package or scope!"
    exit 1
fi

lerna exec --scope "${1}" -- yarn version
