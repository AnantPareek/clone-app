import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

import env from "../config/env.js";

const globalForPrisma = globalThis;

const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  ssl: {
    rejectUnauthorized: false, // Required for Render's self-signed/internal certificates
  },
});

const adapter = globalForPrisma.__prismaAdapter ?? new PrismaPg(pool);

const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prismaAdapter = adapter;
  globalForPrisma.__prisma = prisma;
}

export default prisma;
