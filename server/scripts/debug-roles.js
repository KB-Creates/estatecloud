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

    pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    console.log("=== ALL ROLES IN DB ===");
    const roles = await prisma.role.findMany();
    console.log(JSON.stringify(roles, null, 2));

    console.log("\n=== ALL USERS IN DB (limit 5) ===");
    const users = await prisma.user.findMany({ take: 5 });
    console.log(users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })));

  } catch (error) {
    console.error("Error:", error);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

run();
