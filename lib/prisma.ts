import { PrismaClient } from "@/lib/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    max: 5, // keep pool small for serverless
    idleTimeoutMillis: 10000, // release idle connections before Neon suspends (5min)
    connectionTimeoutMillis: 30000, // allow time for Neon cold-start
    keepAlive: true, // send TCP keepalives to detect dead connections
    keepAliveInitialDelayMillis: 10000,
  });

if (!globalForPrisma.pool) {
  pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
  });
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pool = pool;
}

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}