#!/bin/bash

# Load environment variables
set -a
source .env.local
set +a

# Run contentful import
pnpm exec contentful space import \
  --space-id "$CONTENTFUL_SPACE_ID" \
  --management-token "$CONTENTFUL_MANAGEMENT_TOKEN" \
  --content-file ./contentful/schema.json \
  --content-model-only true
  