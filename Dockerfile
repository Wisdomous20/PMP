FROM node:lts-alpine

# Gather dependencies here
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
COPY prisma/ ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Setting the build environment to production.
ENV NODE_ENV=production

# Next.js collects completely anonymous telemetry data about general usage.
# That's why we gonna disable that crap.
ENV NEXT_TELEMETRY_DISABLED=1

# Build
COPY . ./
# RUN pnpm run build

# Expose the necessary ports for the runtime
ENV PORT=3000
EXPOSE 3000

CMD ["pnpm", "run", "dev"]
