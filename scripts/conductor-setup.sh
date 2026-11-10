#!/bin/bash
set -e

echo "Setting up Conductor..."

# Copy environment variables from the main checkout (a 1Password-mounted pipe)
bash ./scripts/conductor-sync-env.sh

# Install dependencies
echo "Installing dependencies..."
bun install
echo "Setup complete!"