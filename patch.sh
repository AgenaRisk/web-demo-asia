#!/bin/bash

kubectl -n public patch deployment demo-asia --patch '{"spec": {"template": {"metadata": {"labels": {"date": "'$(date +%s)'"}}}}}'
kubectl -n public get pods --watch