import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function resolveDatabaseUrl(): string {
  const bundledDb = path.join(process.cwd(), "prisma", "dev.db");

  // Vercel serverless: copy bundled seed DB to /tmp (only writable path).
  if (process.env.VERCEL === "1") {
    const tmpDb = path.join("/tmp", "sentinel-dev.db");
    try {
      if (fs.existsSync(bundledDb) && !fs.existsSync(tmpDb)) {
        fs.copyFileSync(bundledDb, tmpDb);
      }
      if (fs.existsSync(tmpDb)) {
        return `file:${tmpDb}`;
      }
    } catch {
      // fall through to configured URL
    }
  }

  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  return `file:${bundledDb}`;
}

const databaseUrl = resolveDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: databaseUrl } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
