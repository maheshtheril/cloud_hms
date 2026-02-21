import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL || 'postgresql://hms_admin:password@127.0.0.1:5432/hms_prod';
  console.log("[PRISMA] Initializing with:", connectionString.split('@')[1] || "DEFAULTS");
  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 10000, // wait up to 10s for connection (helps with Neon wake-up)
    idleTimeoutMillis: 30000,
  });

  pool.on('error', (err: Error) => console.error('[PRISMA] Pool Error:', err));

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
