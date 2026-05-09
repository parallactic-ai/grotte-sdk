#!/bin/bash

rm -rf grotte/envd/__pycache__
rm -rf grotte/envd/filesystem/__pycache__
rm -rf grotte/envd/process/__pycache__

sed -i.bak 's/from\ process\ import/from grotte.envd.process import/g' grotte/envd/process/* grotte/envd/filesystem/*
sed -i.bak 's/from\ filesystem\ import/from grotte.envd.filesystem import/g' grotte/envd/process/* grotte/envd/filesystem/*

rm -f grotte/envd/process/*.bak
rm -f grotte/envd/filesystem/*.bak
