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

    // Generate hashed password for demo123
    console.log("Hashing password 'demo123'...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("demo123", salt);

    // 1. Setup Admin Account (demo@test.com)
    console.log("Setting up Admin account (demo@test.com)...");
    let admin = await prisma.user.findUnique({
      where: { email: "demo@test.com" }
    });

    if (admin) {
      admin = await prisma.user.update({
        where: { id: admin.id },
        data: {
          role: "admin",
          password: hashedPassword,
          name: "Demo Admin",
          status: "Active"
        }
      });
      console.log(`Updated Admin: ${admin.name} (${admin.email})`);
    } else {
      admin = await prisma.user.create({
        data: {
          name: "Demo Admin",
          email: "demo@test.com",
          role: "admin",
          password: hashedPassword,
          status: "Active"
        }
      });
      console.log(`Created Admin: ${admin.name} (${admin.email})`);
    }

    // Ensure Admin has a Settings record
    const adminSettings = await prisma.setting.findUnique({
      where: { userId: admin.id }
    });
    if (!adminSettings) {
      await prisma.setting.create({
        data: {
          userId: admin.id,
          storeName: "PropertyNext Demo",
          email: "demo@test.com",
          currency: "$ USD - US Dollar"
        }
      });
      console.log("Created Settings for Demo Admin");
    }

    // 2. Setup Sub-Accounts linked to Demo Admin
    const subAccounts = [
      {
        email: "agent@test.com",
        name: "Demo Agent",
        role: "agent",
        phone: "+923000000001",
        commissionType: "Percentage",
        commissionValue: 5.0,
        experience: 2.5,
        designation: "Property Consultant",
        address: "DHA Phase 6, Lahore",
        notes: "Demo Agent sub-account."
      },
      {
        email: "owner@test.com",
        name: "Demo Owner",
        role: "owner",
        phone: "+923000000002",
        companyName: "Demo Properties Ltd",
        taxId: "NTN-1234567-8",
        address: "Gulberg III, Lahore",
        notes: "Demo Owner sub-account."
      },
      {
        email: "customer@test.com",
        name: "Demo Customer",
        role: "customer",
        phone: "+923000000003",
        address: "Johar Town, Lahore",
        notes: "Demo Customer sub-account."
      }
    ];

    for (const acc of subAccounts) {
      console.log(`Setting up ${acc.role.toUpperCase()} account (${acc.email})...`);
      const existing = await prisma.user.findUnique({
        where: { email: acc.email }
      });

      if (existing) {
        const updated = await prisma.user.update({
          where: { id: existing.id },
          data: {
            name: acc.name,
            role: acc.role,
            password: hashedPassword,
            status: "Active",
            phone: acc.phone,
            commissionType: acc.commissionType || null,
            commissionValue: acc.commissionValue || 0,
            experience: acc.experience || 0,
            designation: acc.designation || null,
            companyName: acc.companyName || null,
            taxId: acc.taxId || null,
            address: acc.address,
            notes: acc.notes,
            createdById: admin.id
          }
        });
        console.log(`Updated ${updated.role.toUpperCase()}: ${updated.name} (${updated.email})`);
      } else {
        const created = await prisma.user.create({
          data: {
            name: acc.name,
            email: acc.email,
            role: acc.role,
            password: hashedPassword,
            status: "Active",
            phone: acc.phone,
            commissionType: acc.commissionType || null,
            commissionValue: acc.commissionValue || 0,
            experience: acc.experience || 0,
            designation: acc.designation || null,
            companyName: acc.companyName || null,
            taxId: acc.taxId || null,
            address: acc.address,
            notes: acc.notes,
            createdById: admin.id
          }
        });
        console.log(`Created ${created.role.toUpperCase()}: ${created.name} (${created.email})`);
      }
    }

    console.log("Database successfully configured for demo mode!");
  } catch (error) {
    console.error("Error during database demo setup:", error);
  } finally {
    if (pool) {
      await pool.end();
    }
    console.log("Disconnected from PostgreSQL.");
  }
}

run();
