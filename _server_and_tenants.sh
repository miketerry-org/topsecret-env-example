#!/bin/bash

# Exit on error
set -e

# Path setup
DECRYPTED_DIR="_decrypted/tenants"
ENCRYPTED_DIR="_encrypted/tenants"
KEYFILE="_secret.key"

# Check keyfile exists
if [ ! -f "$KEYFILE" ]; then
  echo "❌ Key file '$KEYFILE' not found!"
  exit 1
fi

# Encrypt the main server config first
if [ -f "_decrypted/server.env" ]; then
  topsecret encrypt "_decrypted/server.env" "_encrypted/server.secret" --key-file "$KEYFILE"
else
  echo "⚠️  _decrypted/server.env not found, skipping server encryption."
fi

# Loop through all tenant .env files in _decrypted/tenants
find "$DECRYPTED_DIR" -type f -name "*.env" | while read -r ENV_FILE; do
  # Get relative path (e.g. coach1.env)
  REL_PATH="${ENV_FILE#$DECRYPTED_DIR/}"

  # Generate output path by replacing .env with .secret and changing base dir
  SECRET_PATH="$ENCRYPTED_DIR/${REL_PATH%.env}.secret"

  # Ensure destination directory exists
  mkdir -p "$(dirname "$SECRET_PATH")"

  topsecret encrypt "$ENV_FILE" "$SECRET_PATH" --key-file "$KEYFILE"
done

echo "✅ All .env files encrypted!"
