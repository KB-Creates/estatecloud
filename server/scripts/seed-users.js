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

const usersToSeed = [
  // ─── AGENTS ───────────────────────────────────────────────────────────────
  {
    name: "Zahid Mahmood",
    email: "zahid.agent@example.com",
    role: "agent",
    phone: "+923001234567",
    commissionType: "Percentage",
    commissionValue: 5.0,
    experience: 3.5,
    status: "Active",
    specialization: ["Residential Sales", "DHA Real Estate"],
    address: "Phase 5, DHA, Lahore",
    designation: "Senior Property Consultant",
    basicSalary: 0,
    notes: "Top performing residential sales agent."
  },
  {
    name: "Ayesha Khan",
    email: "ayesha.agent@example.com",
    role: "agent",
    phone: "+923219876543",
    commissionType: "Percentage",
    commissionValue: 4.0,
    experience: 2.0,
    status: "Active",
    specialization: ["Luxury Apartments", "Rentals"],
    address: "G-11, Islamabad",
    designation: "Leasing Agent",
    basicSalary: 0,
    notes: "Specializes in modern rental apartments."
  },
  // ─── OWNERS ───────────────────────────────────────────────────────────────
  {
    name: "Ali Raza",
    email: "ali.owner@example.com",
    role: "owner",
    phone: "+923334567890",
    status: "Active",
    address: "Gulberg III, Lahore",
    companyName: "Raza Group of Properties",
    taxId: "NTN-8765432-1",
    commissionType: "Percentage",
    commissionValue: 0,
    experience: 0,
    basicSalary: 0,
    notes: "Owns several DHA Lahore houses."
  },
  {
    name: "Usman Khan",
    email: "usman.owner@example.com",
    role: "owner",
    phone: "+923455551234",
    status: "Active",
    address: "F-8, Islamabad",
    companyName: "UK Enterprises",
    taxId: "NTN-9988776-5",
    commissionType: "Percentage",
    commissionValue: 0,
    experience: 0,
    basicSalary: 0,
    notes: "Commercial office building owner."
  },
  // ─── STAFF ────────────────────────────────────────────────────────────────
  {
    name: "Sana Malik",
    email: "sana.staff@example.com",
    role: "staff",
    phone: "+923124445556",
    status: "Active",
    address: "Johar Town, Lahore",
    designation: "Office Administrator",
    basicSalary: 45000.0,
    commissionType: "Percentage",
    commissionValue: 0,
    experience: 1.5,
    notes: "Handles daily office operations and paperwork."
  },
  {
    name: "Bilal Ahmed",
    email: "bilal.staff@example.com",
    role: "staff",
    phone: "+923013334445",
    status: "Active",
    address: "Rawalpindi",
    designation: "Accounts Officer",
    basicSalary: 55000.0,
    commissionType: "Percentage",
    commissionValue: 0,
    experience: 3.0,
    notes: "Manages payroll, billing, and rent payments."
  },
  // ─── CUSTOMERS ────────────────────────────────────────────────────────────
  {
    name: "Haris Jamil",
    email: "haris.customer@example.com",
    role: "customer",
    phone: "+923348889990",
    status: "Active",
    address: "Model Town, Lahore",
    commissionType: "Percentage",
    commissionValue: 0,
    experience: 0,
    basicSalary: 0,
    notes: "Looking for a 2-bedroom rental apartment in DHA."
  },
  {
    name: "Mariam Tariq",
    email: "mariam.customer@example.com",
    role: "customer",
    phone: "+923227776665",
    status: "Active",
    address: "E-11, Islamabad",
    commissionType: "Percentage",
    commissionValue: 0,
    experience: 0,
    basicSalary: 0,
    notes: "Interested in buying commercial office space."
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
    console.log("Hashing password for mock users...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    console.log(`Seeding ${usersToSeed.length} users...`);
    for (const user of usersToSeed) {
      // Check if user already exists
      const exists = await prisma.user.findUnique({
        where: { email: user.email }
      });

      if (exists) {
        console.log(`User already exists: ${user.name} (${user.email}) - Skipping.`);
        continue;
      }

      const created = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          phone: user.phone,
          commissionType: user.commissionType,
          commissionValue: user.commissionValue,
          experience: user.experience,
          status: user.status,
          specialization: user.specialization || [],
          companyName: user.companyName || null,
          taxId: user.taxId || null,
          designation: user.designation || null,
          basicSalary: user.basicSalary,
          address: user.address,
          notes: user.notes,
          createdById: admin.id
        }
      });
      console.log(`Created ${created.role.toUpperCase()}: ${created.name} (${created.email})`);
    }

    console.log("Successfully seeded all mock users.");
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
