#!/bin/bash

INDEX_NAME="my-index"
AUTH="gritcoding-admin:Gritcoding0*"
ENDPOINT="https://search-demo.gritcoding.co.uk/${INDEX_NAME}/_doc"
FILE="data.json"

curl -u "$AUTH" -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  --data "@$FILE"