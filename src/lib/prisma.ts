import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL || 'postgresql://hms_admin:password@127.0.0.1:5432/hms_prod';
  const host = connectionString.split('@')[1]?.split('/')[0] || "Unknown Host";

  console.log(`\x1b[36m[PRISMA] Initializing PG Pool for: ${host}\x1b[0m`);

  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 10000, // 10s wait for Neon wake-up
    idleTimeoutMillis: 30000,
    max: 20, // Concurrency limit
    ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
      ? false
      : { rejectUnauthorized: false }
  });

  pool.on('error', (err: any) => console.error('\x1b[31m[PRISMA] Pool Event Error:\x1b[0m', err));
  pool.on('connect', () => console.log('\x1b[32m[PRISMA] New client connected to pool\x1b[0m'));

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

// Ensure we reuse the same client in development to avoid pool exhaustion
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
