#! /usr/bin/env bash

./node_modules/.bin/browserify -t vashify index.js > ./public/bundle.js
