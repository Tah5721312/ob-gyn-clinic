// lib/prisma.ts
import "server-only";

import { PrismaClient } from "@prisma/client";
// @ts-ignore - Type definitions may not be available
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env file explicitly (Next.js should do this automatically, but this ensures it)
if (typeof window === "undefined") {
  // Only load in server-side
  config({ path: resolve(process.cwd(), ".env") });
}

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create PostgreSQL pool with SSL configuration
function createPrismaClient() {
  // Check if DATABASE_URL exists
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error("❌ DATABASE_URL is not defined");
    console.error("   Please check your .env file in the project root");
    throw new Error(
      "DATABASE_URL is not defined. Please check your .env file in the project root."
    );
  }

  let cleanDbUrl = dbUrl.trim();
  cleanDbUrl = cleanDbUrl.replace(/^['"]|['"]$/g, ""); // Remove surrounding quotes
  
  // Remove channel_binding=require as it may cause issues with some connection libraries
  cleanDbUrl = cleanDbUrl.replace(/[&?]channel_binding=require/g, "");

  // Debug: Log connection info (without password) in development
  if (process.env.NODE_ENV === "development") {
    const dbInfo = cleanDbUrl.replace(/:[^:@]+@/, ":****@");
    console.log("🔗 Connecting to database:", dbInfo.split("@")[1]?.split("/")[0] || "unknown");
  }

  // Parse connection string to extract SSL settings
  const url = new URL(cleanDbUrl);
  const hasSSL = url.searchParams.get("sslmode") === "require" || url.searchParams.has("ssl");

  const pool = new Pool({
    connectionString: cleanDbUrl,
    ssl: hasSSL
      ? { 
          rejectUnauthorized: false,
        }
      : false,
    max: 100, // Connection pool size
    connectionTimeoutMillis: 10000, // 10 seconds timeout
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter: adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

