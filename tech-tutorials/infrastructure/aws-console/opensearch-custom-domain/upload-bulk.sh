#!/bin/bash

# 설정값
INDEX_NAME="my-index"
AUTH="masterUserName:password" #change this to your username and password
ENDPOINT="opensearchDomain/_bulk" #change this to your openSearch domain endpoint
FOLDER="./bulk"
BULK_FILE="bulk-upload.ndjson"

# bulk 파일 초기화
> "$BULK_FILE"

# jq 설치 여부 확인
if command -v jq >/dev/null 2>&1; then
  USE_JQ=true
else
  echo "[WARN] jq not found – using fallback method to compact JSON manually"
  USE_JQ=false
fi

# JSON 파일들을 bulk 포맷으로 병합
for file in "$FOLDER"/*.json; do
  echo "{ \"index\": { \"_index\": \"${INDEX_NAME}\" } }" >> "$BULK_FILE"

  if [ "$USE_JQ" = true ]; then
    jq -c . "$file" >> "$BULK_FILE"
  else
    cat "$file" | tr -d '\n' | tr -s '[:space:]' >> "$BULK_FILE"
  fi

  echo "" >> "$BULK_FILE"
done

# 업로드 요청
curl -u "$AUTH" -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  --data-binary "@$BULK_FILE"
