# OpenSearch Demo: Indexing Data with Bash Scripts

This project contains example scripts to upload single and bulk JSON documents to an OpenSearch domain using curl.

## Prerequisites

- An OpenSearch domain must be created with a master user.
- Follow the [YouTube video guide](https://www.youtube.com/watch?v=WrMLpKsX6QI). Audio is in Korean, but AWS Console and OpenSearch Dashboard are in English, so it's easy to follow.

## Make Scripts Executable

```bash
chmod +x ./upload-single.sh
chmod +x ./upload-bulk.sh
```

## Update Credentials and Endpoint

Open each script file (upload-single.sh and upload-bulk.sh) and update the following values:

```bash

AUTH="your-username:your-password"
ENDPOINT="https://your-opensearch-domain/_bulk"         # for upload-bulk.sh
ENDPOINT="https://your-opensearch-domain/${INDEX_NAME}/_doc" # for upload-single.sh
```

Replace your-username:your-password with your OpenSearch master credentials.
Replace your-opensearch-domain with your actual OpenSearch endpoint.
Replace my-index with the name of your index.

### Run Scripts

To upload a single document run this:

```bash
./upload-single.sh
```

To upload multiple documents from the bulk/ folder:

```bash
./upload-bulk.sh
```
