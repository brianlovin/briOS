#!/bin/bash
set -e

echo "Setting up Conductor..."

# Copy environment variables
if [ -f "$CONDUCTOR_ROOT_PATH/.env.local" ]; then
    cp "$CONDUCTOR_ROOT_PATH/.env.local" .env.local
    echo "Copied .env.local"
else
    echo "No .env.local found in root repo"
fi

# Install dependencies
echo "Installing dependencies..."
bun install
echo "Setup complete!"