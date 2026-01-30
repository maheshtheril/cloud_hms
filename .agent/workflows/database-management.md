---
description: How to manage and sync the database schema using Prisma
---

# Database Management & Syncing

This workflow explains how to keep the database (Neon Postgres) and the local codebase (Prisma Schema) in sync.

## 1. The Source of Truth
The `prisma/schema.prisma` file is the master plan. It defines what your database *should* look like.

## 2. Syncing Flow

### Scenario A: You changed `schema.prisma` (e.g. added a new table)
To apply these changes to the database:
```bash
# Verify the schema is valid and generate the client
npx prisma generate

# Push changes to the database
npx prisma db push
```
*Note: If using Neon, use the **Direct Connection URL** for this step, as Poolers often block schema changes.*

### Scenario B: You changed the Database directly (or switched databases)
To update your local code to match the database:
```bash
# Pull the schema from the database
npx prisma db pull

# IMPORTANT: Review the changes in schema.prisma! 
# 'db pull' might overwrite custom comments or manual fixes.

# Regenerate the client
npx prisma generate
```

## 3. Handling Connection Issues (Neon)
Neon provides two URLs:
1.  **Pooled URL** (`...-pooler...`): Use this for the App (Code) to handle many connections.
2.  **Direct URL** (No `-pooler`): Use this for `db push` and `migrate`.

If `db push` fails with `P1001` (Can't reach), switch to the Direct URL temporarily.
