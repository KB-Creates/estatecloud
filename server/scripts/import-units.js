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
    console.log("Searching user 'Mudassir Saleem'...");
    const user = await prisma.user.findFirst({
      where: { name: { contains: "Mudassir Saleem", mode: "insensitive" } }
    });
    if (!user) {
      throw new Error("User Mudassir Saleem not found in the database");
    }

    console.log(`Found User: ${user.name} with ID: ${user.id}`);

    // Get properties owned by Mudassir Saleem
    const properties = await prisma.property.findMany({
      where: { userId: user.id }
    });
    if (properties.length === 0) {
      throw new Error("No properties found for Mudassir Saleem to link units to.");
    }

    console.log(`Found ${properties.length} properties owned by Mudassir Saleem.`);

    // Map properties by title keywords for easy retrieval
    const dhaHouse = properties.find(p => p.title.includes("DHA"));
    const bahriaApartment = properties.find(p => p.title.includes("Bahria"));
    const officeSpace = properties.find(p => p.title.includes("Office"));
    const farmhouse = properties.find(p => p.title.includes("Farmhouse"));
    const smallHouse = properties.find(p => p.title.includes("Small House") || p.title.includes("Affordable"));

    const unitsToInsert = [];

    // 1. Units for DHA House (2 units)
    if (dhaHouse) {
      unitsToInsert.push(
        {
          property: dhaHouse.id,
          block: "Block A",
          floor: "Ground Floor",
          unitNumber: "Main-House",
          unitType: "House",
          status: "Available",
          price: 350000,
          areaSize: 8,
          areaUnit: "Marla",
          bedrooms: 4,
          bathrooms: 4,
          windows: 12
        },
        {
          property: dhaHouse.id,
          block: "Block A",
          floor: "1st Floor",
          unitNumber: "Annex-01",
          unitType: "Apartment",
          status: "Rented",
          price: 95000,
          areaSize: 2,
          areaUnit: "Marla",
          bedrooms: 1,
          bathrooms: 2,
          windows: 4
        }
      );
    }

    // 2. Units for Bahria Town Apartment Building (6 units)
    if (bahriaApartment) {
      const aptDetails = [
        { num: "101", floor: "1st Floor", type: "Apartment", price: 80000, size: 1100, status: "Available" },
        { num: "102", floor: "1st Floor", type: "Studio", price: 55000, size: 650, status: "Rented" },
        { num: "201", floor: "2nd Floor", type: "Apartment", price: 85000, size: 1200, status: "Available" },
        { num: "202", floor: "2nd Floor", type: "Apartment", price: 85000, size: 1200, status: "Booked" },
        { num: "301", floor: "3rd Floor", type: "Penthouse", price: 150000, size: 2200, status: "Available" },
        { num: "302", floor: "3rd Floor", type: "Studio", price: 60000, size: 700, status: "Reserved" }
      ];

      aptDetails.forEach(apt => {
        unitsToInsert.push({
          property: bahriaApartment.id,
          block: "Tower B",
          floor: apt.floor,
          unitNumber: apt.num,
          unitType: apt.type,
          status: apt.status,
          price: apt.price,
          areaSize: apt.size,
          areaUnit: "sqft",
          bedrooms: apt.type === "Studio" ? 1 : apt.type === "Penthouse" ? 3 : 2,
          bathrooms: apt.type === "Studio" ? 1 : apt.type === "Penthouse" ? 4 : 2,
          windows: apt.type === "Studio" ? 2 : apt.type === "Penthouse" ? 8 : 4
        });
      });
    }

    // 3. Units for Commercial Office Space (5 units)
    if (officeSpace) {
      const officeDetails = [
        { num: "Off-101", floor: "Ground Floor", size: 1500, price: 120000, status: "Available" },
        { num: "Off-102", floor: "Ground Floor", size: 1500, price: 120000, status: "Rented" },
        { num: "Off-201", floor: "1st Floor", size: 3000, price: 250000, status: "Available" },
        { num: "Off-202", floor: "1st Floor", size: 1500, price: 130000, status: "Available" },
        { num: "Off-301", floor: "Penthouse Floor", size: 4000, price: 400000, status: "Reserved" }
      ];

      officeDetails.forEach(off => {
        unitsToInsert.push({
          property: officeSpace.id,
          block: "Main Wing",
          floor: off.floor,
          unitNumber: off.num,
          unitType: "Office",
          status: off.status,
          price: off.price,
          areaSize: off.size,
          areaUnit: "sqft",
          bedrooms: 0,
          bathrooms: 2,
          windows: 6
        });
      });
    }

    // 4. Units for Farmhouse (2 units)
    if (farmhouse) {
      unitsToInsert.push(
        {
          property: farmhouse.id,
          block: "Main Estate",
          floor: "Ground Floor",
          unitNumber: "Villa-01",
          unitType: "Villa",
          status: "Available",
          price: 500000,
          areaSize: 1.5,
          areaUnit: "Kanal",
          bedrooms: 5,
          bathrooms: 6,
          windows: 16
        },
        {
          property: farmhouse.id,
          block: "Annex",
          floor: "Ground Floor",
          unitNumber: "Cottage-A",
          unitType: "House",
          status: "Available",
          price: 150000,
          areaSize: 0.5,
          areaUnit: "Kanal",
          bedrooms: 2,
          bathrooms: 2,
          windows: 5
        }
      );
    }

    // 5. Units for Small House (5 units)
    if (smallHouse) {
      const houseUnits = [
        { num: "GF-01", floor: "Ground Floor", price: 45000, size: 2.5, status: "Available" },
        { num: "FF-01", floor: "1st Floor", price: 40000, size: 2.5, status: "Rented" },
        { num: "SF-01", floor: "2nd Floor", price: 35000, size: 2.5, status: "Available" },
        { num: "B-01", floor: "Basement Suite", price: 25000, size: 1.5, status: "Available" },
        { num: "Ann-A", floor: "Annexure", price: 20000, size: 1.0, status: "Rented" }
      ];

      houseUnits.forEach(hu => {
        unitsToInsert.push({
          property: smallHouse.id,
          block: "Block C",
          floor: hu.floor,
          unitNumber: hu.num,
          unitType: "House",
          status: hu.status,
          price: hu.price,
          areaSize: hu.size,
          areaUnit: "Marla",
          bedrooms: hu.num.includes("Ann") ? 1 : 2,
          bathrooms: hu.num.includes("Ann") ? 1 : 2,
          windows: 3
        });
      });
    }

    console.log(`Prepared ${unitsToInsert.length} units to insert.`);
    console.log(`Inserting ${unitsToInsert.length} units...`);
    
    for (const unit of unitsToInsert) {
      await prisma.unit.create({
        data: {
          unitNumber: unit.unitNumber,
          block: unit.block || null,
          floor: unit.floor || null,
          unitType: unit.unitType || null,
          status: unit.status || 'Available',
          price: Number(unit.price),
          areaSize: Number(unit.areaSize),
          areaUnit: unit.areaUnit || 'sqft',
          bedrooms: unit.bedrooms,
          bathrooms: unit.bathrooms,
          windows: unit.windows,
          propertyId: unit.property,
          userId: user.id
        }
      });
      console.log(`Inserted unit: ${unit.unitNumber} (${unit.unitType})`);
    }
    console.log("Successfully inserted all units.");
  } catch (error) {
    console.error("Error during import:", error);
  } finally {
    if (pool) {
      await pool.end();
    }
    console.log("Disconnected from PostgreSQL.");
  }
}

run();
