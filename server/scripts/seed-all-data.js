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

async function seed() {
  let pool;
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL not found in env");
    }

    console.log("Connecting to PostgreSQL database...");
    pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });
    console.log("Connected successfully.");

    // Hash password for accounts
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("demo123", salt);

    console.log("--- 1. SEEDING ROLES ---");
    const rolesData = [
      { name: "Admin", description: "Full system control and access", permissions: ["all"], isSystem: true },
      { name: "Agent", description: "Manages property listings and client inquiries", permissions: ["properties_read", "properties_write", "inquiries_manage", "bookings_read"], isSystem: true },
      { name: "Owner", description: "Views owned properties, contracts, and revenue", permissions: ["properties_read", "financials_read"], isSystem: true },
      { name: "Staff", description: "Office administrative and maintenance support", permissions: ["maintenance_manage", "expenses_read"], isSystem: true },
      { name: "Customer", description: "Client account for searching and booking properties", permissions: ["bookings_create", "inquiries_create"], isSystem: true }
    ];

    for (const r of rolesData) {
      await prisma.role.upsert({
        where: { name: r.name },
        update: r,
        create: r
      });
    }
    console.log("Roles seeded successfully.");

    console.log("--- 2. SEEDING USERS ---");
    // Main Admin
    let admin = await prisma.user.findFirst({
      where: { role: "admin" }
    });

    if (!admin) {
      admin = await prisma.user.create({
        data: {
          name: "Mudassir Saleem",
          email: "admin@propertynext.com",
          password: hashedPassword,
          role: "admin",
          phone: "+923001234567",
          status: "Active",
          designation: "Managing Director",
          address: "DHA Phase 5, Lahore"
        }
      });
    }

    // Demo Admin (demo@test.com)
    const demoAdmin = await prisma.user.upsert({
      where: { email: "demo@test.com" },
      update: { password: hashedPassword, role: "admin" },
      create: {
        name: "Demo Admin",
        email: "demo@test.com",
        password: hashedPassword,
        role: "admin",
        phone: "+923000000000",
        status: "Active",
        designation: "System Administrator",
        createdById: admin.id
      }
    });

    // Create Setting for Admin
    await prisma.setting.upsert({
      where: { userId: admin.id },
      update: { storeName: "PropertyNext Management System" },
      create: {
        userId: admin.id,
        storeName: "PropertyNext Management System",
        phone: "+923001234567",
        email: "admin@propertynext.com",
        website: "https://propertynext.com",
        address: "DHA Phase 5, Lahore, Pakistan",
        currency: "PKR - Pakistani Rupee",
        timezone: "(GMT+05:00) Islamabad, Karachi",
        taxRate: 5.0,
        enableSMS: true,
        enableEmail: true,
        enableAIReporting: true
      }
    });

    // Seed Owners
    const owner1 = await prisma.user.upsert({
      where: { email: "ali.owner@example.com" },
      update: {},
      create: {
        name: "Ali Raza",
        email: "ali.owner@example.com",
        password: hashedPassword,
        role: "owner",
        phone: "+923334567890",
        companyName: "Raza Real Estate Group",
        taxId: "NTN-8765432-1",
        status: "Active",
        address: "Gulberg III, Lahore",
        createdById: admin.id
      }
    });

    const owner2 = await prisma.user.upsert({
      where: { email: "usman.owner@example.com" },
      update: {},
      create: {
        name: "Usman Khan",
        email: "usman.owner@example.com",
        password: hashedPassword,
        role: "owner",
        phone: "+923455551234",
        companyName: "UK Commercial Towers",
        taxId: "NTN-9988776-5",
        status: "Active",
        address: "F-8 Markaz, Islamabad",
        createdById: admin.id
      }
    });

    // Seed Agents
    const agent1 = await prisma.user.upsert({
      where: { email: "zahid.agent@example.com" },
      update: {},
      create: {
        name: "Zahid Mahmood",
        email: "zahid.agent@example.com",
        password: hashedPassword,
        role: "agent",
        phone: "+923001112233",
        designation: "Senior Property Consultant",
        commissionType: "Percentage",
        commissionValue: 5.0,
        experience: 4.5,
        status: "Active",
        specialization: ["Luxury Villas", "Commercial Plots"],
        address: "DHA Phase 6, Lahore",
        createdById: admin.id
      }
    });

    const agent2 = await prisma.user.upsert({
      where: { email: "ayesha.agent@example.com" },
      update: {},
      create: {
        name: "Ayesha Khan",
        email: "ayesha.agent@example.com",
        password: hashedPassword,
        role: "agent",
        phone: "+923219876543",
        designation: "Leasing Specialist",
        commissionType: "Percentage",
        commissionValue: 4.0,
        experience: 3.0,
        status: "Active",
        specialization: ["Apartment Rentals", "Retail Outlets"],
        address: "G-11, Islamabad",
        createdById: admin.id
      }
    });

    // Seed Staff
    const staff1 = await prisma.user.upsert({
      where: { email: "sana.staff@example.com" },
      update: {},
      create: {
        name: "Sana Malik",
        email: "sana.staff@example.com",
        password: hashedPassword,
        role: "staff",
        phone: "+923124445556",
        designation: "Office Manager",
        basicSalary: 65000,
        status: "Active",
        address: "Johar Town, Lahore",
        createdById: admin.id
      }
    });

    const staff2 = await prisma.user.upsert({
      where: { email: "bilal.staff@example.com" },
      update: {},
      create: {
        name: "Bilal Ahmed",
        email: "bilal.staff@example.com",
        password: hashedPassword,
        role: "staff",
        phone: "+923013334445",
        designation: "Senior Accountant",
        basicSalary: 75000,
        status: "Active",
        address: "Satellite Town, Rawalpindi",
        createdById: admin.id
      }
    });

    // Seed Customers
    const customer1 = await prisma.user.upsert({
      where: { email: "haris.customer@example.com" },
      update: {},
      create: {
        name: "Haris Jamil",
        email: "haris.customer@example.com",
        password: hashedPassword,
        role: "customer",
        phone: "+923348889990",
        status: "Active",
        address: "Model Town, Lahore",
        createdById: admin.id
      }
    });

    const customer2 = await prisma.user.upsert({
      where: { email: "mariam.customer@example.com" },
      update: {},
      create: {
        name: "Mariam Tariq",
        email: "mariam.customer@example.com",
        password: hashedPassword,
        role: "customer",
        phone: "+923227776665",
        status: "Active",
        address: "E-11, Islamabad",
        createdById: admin.id
      }
    });

    console.log("Users seeded successfully.");

    console.log("--- 3. SEEDING PROPERTIES ---");
    const existingProps = await prisma.property.findMany();
    let prop1, prop2, prop3;

    if (existingProps.length > 0) {
      prop1 = existingProps[0];
      prop2 = existingProps[1] || existingProps[0];
      prop3 = existingProps[2] || existingProps[0];
    } else {
      prop1 = await prisma.property.create({
        data: {
          title: "Modern 1 Kanal Luxury Villa",
          description: "Stunning 5 Bedroom designer villa with private garden, swimming pool, and Italian kitchen.",
          propertyType: "House",
          purpose: "Rent",
          price: 350000,
          status: "Available",
          areaSize: 4500,
          areaUnit: "Sq Ft",
          bedrooms: 5,
          bathrooms: 6,
          parkingSpots: 3,
          propertyAge: 1,
          amenities: ["Swimming Pool", "Lawn", "Servant Quarter", "Solar Power", "CCTV Security"],
          address: "Block FF, DHA Phase 6",
          city: "Lahore",
          state: "Punjab",
          zipCode: "54000",
          country: "Pakistan",
          agent: agent1.name,
          owner: owner1.name,
          isFeatured: true,
          isHot: true,
          userId: admin.id
        }
      });

      prop2 = await prisma.property.create({
        data: {
          title: "Centaurus Luxury Heights Apartment",
          description: "Premium 2 Bedroom furnished apartment with panoramic views of Margalla Hills.",
          propertyType: "Apartment",
          purpose: "Rent",
          price: 180000,
          status: "Rented",
          areaSize: 1800,
          areaUnit: "Sq Ft",
          bedrooms: 2,
          bathrooms: 2,
          parkingSpots: 1,
          propertyAge: 3,
          amenities: ["Elevator", "Gym", "Concierge", "Underground Parking", "Central AC"],
          address: "F-8/4, Blue Area",
          city: "Islamabad",
          state: "Capital",
          zipCode: "44000",
          country: "Pakistan",
          agent: agent2.name,
          owner: owner2.name,
          isFeatured: true,
          isHot: false,
          userId: admin.id
        }
      });

      prop3 = await prisma.property.create({
        data: {
          title: "Gulberg Corporate Business Plaza",
          description: "State-of-the-art commercial office floors for corporate headquarters and IT tech hubs.",
          propertyType: "Commercial",
          purpose: "Sale",
          price: 45000000,
          status: "Available",
          areaSize: 12000,
          areaUnit: "Sq Ft",
          bedrooms: 0,
          bathrooms: 8,
          parkingSpots: 10,
          propertyAge: 2,
          amenities: ["Backup Generator", "High-speed Elevator", "24/7 Security", "Fire Alarm"],
          address: "Main Boulevard, Gulberg III",
          city: "Lahore",
          state: "Punjab",
          zipCode: "54600",
          country: "Pakistan",
          agent: agent1.name,
          owner: owner1.name,
          isFeatured: false,
          isHot: true,
          userId: admin.id
        }
      });
    }

    console.log("Properties seeded successfully.");

    console.log("--- 4. SEEDING UNITS ---");
    let unit1 = await prisma.unit.findFirst({ where: { propertyId: prop1.id } });
    if (!unit1) {
      unit1 = await prisma.unit.create({
        data: {
          unitNumber: "Villa-A1",
          block: "Block FF",
          floor: "Ground + 1st",
          unitType: "Villa",
          status: "Available",
          price: 350000,
          areaSize: 4500,
          bedrooms: 5,
          bathrooms: 6,
          propertyId: prop1.id,
          userId: admin.id
        }
      });
    }

    let unit2 = await prisma.unit.findFirst({ where: { propertyId: prop2.id } });
    if (!unit2) {
      unit2 = await prisma.unit.create({
        data: {
          unitNumber: "Apt-1204",
          block: "Tower B",
          floor: "12th Floor",
          unitType: "Residential Apartment",
          status: "Occupied",
          price: 180000,
          areaSize: 1800,
          bedrooms: 2,
          bathrooms: 2,
          propertyId: prop2.id,
          userId: admin.id
        }
      });
    }
    console.log("Units seeded successfully.");

    console.log("--- 5. SEEDING BOOKINGS ---");
    const existingBookings = await prisma.booking.findMany();
    if (existingBookings.length === 0) {
      await prisma.booking.create({
        data: {
          customerName: customer1.name,
          email: customer1.email,
          phone: customer1.phone || "+923348889990",
          agent: agent1.name,
          status: "Confirmed",
          totalPrice: 350000,
          tokenAmount: 50000,
          advancePayment: 100000,
          remainingAmount: 200000,
          notes: "Customer confirmed rental booking for DHA Villa. Token paid.",
          userId: customer1.id,
          propertyId: prop1.id,
          unitId: unit1.id
        }
      });

      await prisma.booking.create({
        data: {
          customerName: customer2.name,
          email: customer2.email,
          phone: customer2.phone || "+923227776665",
          agent: agent2.name,
          status: "Pending Request",
          totalPrice: 180000,
          tokenAmount: 20000,
          advancePayment: 50000,
          remainingAmount: 110000,
          notes: "Inquired about Centaurus Heights Apt rent agreement.",
          userId: customer2.id,
          propertyId: prop2.id,
          unitId: unit2.id
        }
      });
    }
    console.log("Bookings seeded successfully.");

    console.log("--- 6. SEEDING CONTRACTS ---");
    let contract1 = await prisma.contract.findFirst({ where: { propertyId: prop2.id } });
    if (!contract1) {
      contract1 = await prisma.contract.create({
        data: {
          contractNumber: "CNT-2026-001",
          contractType: "Rental Agreement",
          clientName: customer2.name,
          status: "Active",
          startDate: new Date("2026-01-01"),
          endDate: new Date("2026-12-31"),
          rentAmount: 180000,
          billingCycle: "Monthly",
          securityDeposit: 360000,
          lateFee: 5000,
          notes: "1 year lease contract signed for Centaurus Apt 1204.",
          propertyId: prop2.id,
          unitId: unit2.id,
          userId: admin.id
        }
      });
    }
    console.log("Contracts seeded successfully.");

    console.log("--- 7. SEEDING PAYMENTS ---");
    const existingPayments = await prisma.payment.findMany();
    if (existingPayments.length === 0) {
      await prisma.payment.create({
        data: {
          client: customer2.name,
          paymentType: "Monthly Rent",
          paymentMethod: "Bank Transfer",
          billingMonth: "July",
          billingYear: 2026,
          baseAmount: 180000,
          receivedAmount: 180000,
          balance: 0,
          status: "Paid",
          verificationCode: "TRX-998822",
          internalNotes: "July rent received via Meezan Bank Online Transfer.",
          propertyId: prop2.id,
          unitId: unit2.id,
          contractId: contract1.id,
          createdById: admin.id
        }
      });
    }
    console.log("Payments seeded successfully.");

    console.log("--- 8. SEEDING EXPENSES & MAINTENANCE ---");
    const existingExpenses = await prisma.expense.findMany();
    if (existingExpenses.length === 0) {
      await prisma.expense.create({
        data: {
          title: "HVAC Servicing & AC Repair",
          category: "Maintenance",
          amount: 25000,
          paymentMethod: "Cash",
          notes: "Servicing of 5 AC split units before tenant move-in.",
          status: "Paid",
          propertyId: prop1.id,
          unitId: unit1.id,
          createdById: admin.id
        }
      });
    }

    const existingMaint = await prisma.maintenance.findMany();
    if (existingMaint.length === 0) {
      await prisma.maintenance.create({
        data: {
          requestedBy: customer2.name,
          email: customer2.email || "customer@test.com",
          phone: customer2.phone || "+923000000003",
          title: "Water Tap Leakage in Master Bathroom",
          type: "Plumbing",
          description: "Minor leakage in master washroom vanity tap.",
          priority: "Medium",
          status: "In Progress",
          estimatedCost: 3500,
          userId: admin.id,
          propertyId: prop2.id,
          unitId: unit2.id
        }
      });
    }

    console.log("--- 9. SEEDING INQUIRIES & PAYROLL & NOTIFICATIONS ---");
    const existingInquiries = await prisma.inquiry.findMany();
    if (existingInquiries.length === 0) {
      await prisma.inquiry.create({
        data: {
          name: "Dr. Kamran Akmal",
          phone: "+923005554433",
          propertyType: "Commercial Office",
          purpose: "Buy",
          budget: "PKR 50-60 Million",
          city: "Lahore",
          status: "In Progress",
          priority: "High",
          remarks: "Wants to inspect Gulberg Commercial Plaza floor on Saturday.",
          userId: admin.id,
          assignedToId: agent1.id
        }
      });
    }

    const existingPayroll = await prisma.payroll.findMany();
    if (existingPayroll.length === 0) {
      await prisma.payroll.create({
        data: {
          month: "July",
          year: 2026,
          baseSalary: 75000,
          bonus: 10000,
          deductions: 0,
          totalAmount: 85000,
          status: "Paid",
          paymentMethod: "Bank Transfer",
          transactionId: "PAY-2026-07-01",
          staffId: staff2.id,
          createdById: admin.id
        }
      });
    }

    const existingNotif = await prisma.notification.findMany();
    if (existingNotif.length === 0) {
      await prisma.notification.create({
        data: {
          title: "New Booking Received",
          description: `Haris Jamil requested booking for Modern 1 Kanal Villa.`,
          type: "booking",
          status: "unread",
          userId: admin.id
        }
      });
    }

    console.log("Database seeded successfully with all tables and realistic demo data!");

  } catch (err) {
    console.error("Error during database seed execution:", err);
  } finally {
    if (pool) {
      await pool.end();
    }
    console.log("Disconnected from database.");
  }
}

seed();
