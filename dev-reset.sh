#!/bin/bash

set -e

echo "--- Stopping and removing containers, volumes, and networks..."
docker compose down -v --remove-orphans

echo "--- Removing frontend and backend images (if they exists)..."
docker rmi tasks-frontend || echo "- Frontend image not found, skipping..."
docker rmi tasks-backend || echo "- Backend image not found, skipping..."

echo "--- Removing volumes (optional)..."
docker volume prune -f

echo "--- Rebuilding and starting containers..."
docker compose up --build