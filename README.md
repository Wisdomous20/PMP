# This is CPU's Project Management System

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Requirements

1. Docker Engine/Docker Desktop
2. Git
3. Node.js 22 or later
4. pnpm

## Setting up Development Environment

1. To initialize the self-hosted mongo instance:
   ```sh
   sudo docker compose -f docker-compose.dev.yml up
   ```

2. Then modify your `.env` file with this value:
   ```env
   DATABASE_URL="mongodb://localhost:27017,localhost:27018,localhost:27019/pmp?replicaSet=pmpReplicaSet"
   ```

3. Then, start the development mode:
   ```sh
   pnpm run dev
   ```

> [!TIP]
> If you encounter `Kind: Server selection timeout: No available servers.` while attempting to read/write to
> the Database, you need to modify your `/etc/hosts` (or `C:\Windows\System32\drivers\etc\hosts` on Windows)
> file with the following:
> ```
> 127.0.0.1 mongo1
> 127.0.0.1 mongo2
> 127.0.0.1 mongo3
> ```
> Then restart the Next.js server.

## Deploying

```
sudo docker compose up -d
```

> [!CAUTION]
> If you have modified your `/etc/hosts` file to include these lines:
> ```
> 127.0.0.1 mongo1
> 127.0.0.1 mongo2
> 127.0.0.1 mongo3
> ```
> You may have to remove them because it might affect the DNS resolution of your databases.
