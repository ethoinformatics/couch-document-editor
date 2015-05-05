#! /usr/bin/env bash

./node_modules/.bin/browserify -t vashify -t node-lessify index.js > ./public/bundle.js
