import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function clearAllData() {
  let client;
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL not found in env");
    }

    console.log("Connecting to PostgreSQL database...");
    client = new pg.Client({ connectionString });
    await client.connect();
    console.log("Connected successfully.");

    const tables = [
      "trash",
      "notifications",
      "settings",
      "payrolls",
      "inquiries",
      "bookings",
      "maintenances",
      "expenses",
      "payments",
      "contracts",
      "units",
      "properties",
      "roles",
      "users"
    ];

    console.log("Truncating all tables in database...");
    const truncateQuery = `TRUNCATE TABLE ${tables.map(t => `"${t}"`).join(', ')} RESTART IDENTITY CASCADE;`;
    await client.query(truncateQuery);

    console.log("ALL DATA successfully cleared from all tables!");
  } catch (err) {
    console.error("Error clearing database data:", err);
  } finally {
    if (client) {
      await client.end();
    }
    console.log("Disconnected from database.");
  }
}

clearAllData();
