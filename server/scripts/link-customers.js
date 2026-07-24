import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
  let pool;
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL not found in env");
    }

    console.log("Connecting to PostgreSQL...");
    pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });
    console.log("Connected successfully.");

    // Find Mudassir Saleem
    const admin = await prisma.user.findFirst({
      where: { name: { contains: "Mudassir Saleem", mode: "insensitive" } }
    });
    if (!admin) {
      throw new Error("User Mudassir Saleem not found in the database");
    }
    console.log(`Found Admin Mudassir Saleem with ID: ${admin.id}`);

    // Update all customers
    console.log("Linking all customers to Mudassir Saleem's account...");
    const result = await prisma.user.updateMany({
      where: { role: { equals: "customer", mode: "insensitive" } },
      data: {
        createdById: admin.id,
        ownerId: admin.id
      }
    });

    console.log(`Successfully linked ${result.count} customers to Mudassir Saleem's account.`);
  } catch (error) {
    console.error("Error during linking:", error);
  } finally {
    if (pool) {
      await pool.end();
    }
    console.log("Disconnected from PostgreSQL.");
  }
}

run();
