import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import env from "../config/env.js";

const globalForPrisma = globalThis;

const adapter = globalForPrisma.__prismaAdapter ?? new PrismaPg({
  connectionString: env.databaseUrl,
});

const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prismaAdapter = adapter;
  globalForPrisma.__prisma = prisma;
}

export default prisma;
