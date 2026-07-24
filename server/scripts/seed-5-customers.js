import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const newCustomers = [
  {
    name: "Muhammad Farhan",
    email: "farhan.customer@example.com",
    role: "customer",
    phone: "+923005556667",
    status: "Active",
    address: "Phase 8, Bahria Town, Rawalpindi",
    notes: "Looking for a luxury house on lease."
  },
  {
    name: "Kiran Shehzadi",
    email: "kiran.customer@example.com",
    role: "customer",
    phone: "+923214448889",
    status: "Active",
    address: "Samanabad, Lahore",
    notes: "Interested in retail shop spaces in Gulberg."
  },
  {
    name: "Zainab Bibi",
    email: "zainab.customer@example.com",
    role: "customer",
    phone: "+923331112223",
    status: "Active",
    address: "F-10 Markaz, Islamabad",
    notes: "Tenant looking for a 1-bedroom studio apartment."
  },
  {
    name: "Adnan Qureshi",
    email: "adnan.customer@example.com",
    role: "customer",
    phone: "+923458883332",
    status: "Active",
    address: "Defence Phase 2, Karachi",
    notes: "Overseas buyer looking for featured residential houses."
  },
  {
    name: "Fatima Sajid",
    email: "fatima.customer@example.com",
    role: "customer",
    phone: "+923129994441",
    status: "Active",
    address: "Wapda Town, Lahore",
    notes: "Looking for a farmhouse on rent for events."
  }
];

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

    // Find Mudassir Saleem to link as creator
    console.log("Searching user 'Mudassir Saleem'...");
    const admin = await prisma.user.findFirst({
      where: { name: { contains: "Mudassir Saleem", mode: "insensitive" } }
    });
    if (!admin) {
      throw new Error("User Mudassir Saleem not found in the database");
    }
    console.log(`Found Creator Admin: ${admin.name} with ID: ${admin.id}`);

    // Encrypt password for mock users
    console.log("Hashing password for customers...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    console.log(`Seeding ${newCustomers.length} new customers...`);
    for (const customer of newCustomers) {
      // Check if customer already exists
      const exists = await prisma.user.findUnique({
        where: { email: customer.email }
      });

      if (exists) {
        console.log(`Customer already exists: ${customer.name} (${customer.email}) - Skipping.`);
        continue;
      }

      const created = await prisma.user.create({
        data: {
          name: customer.name,
          email: customer.email,
          password: hashedPassword,
          role: customer.role,
          phone: customer.phone,
          commissionType: "Percentage",
          commissionValue: 0,
          experience: 0,
          status: customer.status,
          specialization: [],
          basicSalary: 0,
          address: customer.address,
          notes: customer.notes,
          createdById: admin.id
        }
      });
      console.log(`Created CUSTOMER: ${created.name} (${created.email})`);
    }

    console.log("Successfully seeded all 5 new customers.");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    if (pool) {
      await pool.end();
    }
    console.log("Disconnected from PostgreSQL.");
  }
}

run();
