#!/bin/bash

INDEX_NAME="my-index"
AUTH="masterUserName:password*"
ENDPOINT="opensearchDomain/${INDEX_NAME}/_doc"
FILE="data.json"

curl -u "$AUTH" -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  --data "@$FILE"