#!/bin/bash

BASEDIR=$(dirname "$0")
cd $BASEDIR

./build.sh

kubectx agenaAksStaging
./patch.sh