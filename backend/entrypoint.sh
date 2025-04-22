#!/bin/bash
set -e

DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-user}
NODE_ENV=${NODE_ENV:-production}  # Add this line to check the environment

# Load .env manually if not injected (optional fail-safe)
if [ ! -z "$DEBUG" ]; then
  echo "📄 Using env vars:"
  env | grep DB_
fi

echo "🔄 Waiting for PostgreSQL to be ready..."

timeout=30
while ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" && [ $timeout -gt 0 ]; do
  echo "⏳ Waiting for DB... $timeout seconds left"
  sleep 2
  ((timeout-=2))
done

if [ $timeout -le 0 ]; then
  echo "❌ Database not ready in time. Exiting."
  exit 1
fi

echo "✅ Database is up."

# Run migration based on environment
echo "🛠 Deploying the migrations..."

# if change were done in the schema.prisma file, you would run the following on your local host
# npx prisma migrate dev --name <your-migration-name> 
# That will do the following:
# 1. Creates a new migration file in prisma/migrations
# 2. Applies the changes to your local PostgreSQL database
# 3. Updates the prisma/migration_lock.toml and prisma/migrations directory
# 4. Regenerates the Prisma Client

# This will just deploy the current generated migrations
npx prisma migrate deploy

echo "🚀 Starting NestJS API..."

# ... after successful DB migration
# echo "🧬 Generating Prisma Client at runtime..."
# npx prisma generate

if [ -f dist/main.js ]; then
  exec node dist/main
else
  echo "❌ dist/main.js not found! Did you forget to build the project?"
  ls -la dist  # Show contents
  exit 1
fi

