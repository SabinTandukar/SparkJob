import "dotenv/config.js";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

// which database driver should i use? so we write
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
// this tells prisma: use PostgreSQL and connect using this database connection string

// then
export const prisma = new PrismaClient({ adapter });
// tells prisma to use that PostgreSQL adapter
