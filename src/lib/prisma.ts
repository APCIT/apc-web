import { PrismaClient } from "@prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaMssql(connectionString);
export const prisma = new PrismaClient({ adapter });