#!/bin/bash

INDEX_NAME="my-index"
AUTH="masterUserName:password" #change this to your username and password
ENDPOINT="opensearchDomain/${INDEX_NAME}/_doc" #change this to your openSearch domain endpoint
FILE="data.json"

curl -u "$AUTH" -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  --data "@$FILE"