FROM node:20

WORKDIR /app

# 👇 Install postgresql-client for DB wait check
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*


# Install deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy app source
COPY . .

# Generate Prisma Client BEFORE build
COPY prisma ./prisma
RUN npx prisma generate

# Build NestJS project
RUN yarn build

# Copy entry script and set permissions
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Use the entrypoint script to handle migrations and start the app
ENTRYPOINT ["/entrypoint.sh"]
