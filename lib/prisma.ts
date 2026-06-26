import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  // Managed Postgres (Vercel/Neon) requires SSL; local Postgres usually doesn't support it.
  const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);
  const pool = new Pool({ connectionString, ssl: isLocal ? undefined : true });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

function getInstance(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Lazy proxy: does not connect at module-load time; throws on first query if DATABASE_URL is missing.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const client = getInstance();
    const val = (client as any)[prop];
    return typeof val === 'function' ? (val as Function).bind(client) : val;
  },
});
