#!/bin/bash

# Load environment variables
set -a
source .env.local
set +a

# Run contentful export
pnpm exec contentful space export \
  --space-id "$CONTENTFUL_SPACE_ID" \
  --management-token "$CONTENTFUL_MANAGEMENT_TOKEN" \
  --content-file ./contentful/schema.json \
  --skip-content true \
  --skip-roles true \
  --skip-tags true \
  --skip-webhooks true \
  --skip-editor-interfaces true
