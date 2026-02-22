import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL || 'postgresql://hms_admin:password@127.0.0.1:5432/hms_prod';

  // CRITICAL DEBUG: Help user see if they are on the right DB
  const host = connectionString.split('@')[1]?.split('/')[0] || "UNKNOWN";
  console.log(`\x1b[33m[PRISMA] CONNECTING TO: ${host}\x1b[0m`);

  if (host.includes('-pooler')) {
    console.warn(`\x1b[31;1m[WARNING] YOU ARE CONNECTED VIA POOLER: ${host}\x1b[0m`);
    console.warn(`\x1b[31m[WARNING] This is likely why DNS resolution is failing. Please check your .env and restart dev server.\x1b[0m`);
  }

  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 10000, // wait up to 10s for connection (helps with Neon wake-up)
    idleTimeoutMillis: 30000,
  });

  pool.on('error', (err: Error) => console.error('\x1b[31m[PRISMA] Pool Error:\x1b[0m', err));

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  });
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// Simple export without complex extensions for now to ensure stability
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
