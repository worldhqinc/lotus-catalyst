#!/bin/bash

# Check if a file path argument is provided
if [ -z "$1" ]; then
  echo "Error: No content file path provided."
  echo "Usage: $0 <path_to_content_file>"
  exit 1
fi

# Load environment variables
set -a
source .env.local
set +a

# Run contentful import
pnpm exec contentful space import \
  --space-id "$CONTENTFUL_SPACE_ID" \
  --management-token "$CONTENTFUL_MANAGEMENT_TOKEN" \
  --content-file "$1" \
  --content-model-only true
  