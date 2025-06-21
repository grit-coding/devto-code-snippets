#!/bin/bash

# 설정값
INDEX_NAME="my-index"
AUTH="masterUserName:password" #change this to your username and password
AUTH="gritcoding-admin:HelloWorld!1"
ENDPOINT="opensearchDomain/_bulk" #change this to your openSearch domain endpoint
FOLDER="./bulk-folder"

> "$BULK_FILE"

for file in "$FOLDER"/*.json; do
  echo "{ \"index\": { \"_index\": \"${INDEX_NAME}\" } }" >> "$BULK_FILE"
  cat "$file" >> "$BULK_FILE"
  echo "" >> "$BULK_FILE"
done


curl -u "$AUTH" -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  --data-binary "@$BULK_FILE"
