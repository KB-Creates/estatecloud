import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const propertiesToInsert = [
    {
        title: "Luxury Family House in DHA",
        description: "Beautiful modern house with spacious rooms and garden.",
        propertyType: "House",
        purpose: "Sale",
        price: 45000000,
        status: "Available",
        areaSize: 10,
        areaUnit: "Marla",
        bedrooms: 5,
        bathrooms: 6,
        parkingSpots: 2,
        propertyAge: 3,
        amenities: ["Electricity", "Gas", "Internet", "Garden"],
        address: "Street 12, DHA Phase 6",
        city: "Lahore",
        state: "Punjab",
        zipCode: "54000",
        country: "Pakistan",
        lat: 31.4697,
        lng: 74.3852,
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop"
        ],
        agent: "Ahmed Real Estate",
        owner: "Ali Raza",
        isFeatured: true,
        isHot: true
    },
    {
        title: "Modern Apartment Near Bahria Town",
        description: "2 bed apartment with modern kitchen and balcony.",
        propertyType: "Apartment",
        purpose: "Rent",
        price: 85000,
        status: "Available",
        areaSize: 1200,
        areaUnit: "Sq Ft",
        bedrooms: 2,
        bathrooms: 2,
        parkingSpots: 1,
        propertyAge: 1,
        amenities: ["Lift", "Security", "Gym"],
        address: "Sector C, Bahria Town",
        city: "Islamabad",
        state: "Punjab",
        zipCode: "44000",
        country: "Pakistan",
        lat: 33.5651,
        lng: 73.1481,
        images: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
        ],
        agent: "Capital Realtors",
        owner: "Usman Khan",
        isFeatured: false,
        isHot: true
    },
    {
        title: "Commercial Office Space",
        description: "Office available for software house and startups.",
        propertyType: "Office",
        purpose: "Lease",
        price: 250000,
        status: "Available",
        areaSize: 3000,
        areaUnit: "Sq Ft",
        bedrooms: 0,
        bathrooms: 2,
        parkingSpots: 5,
        propertyAge: 5,
        amenities: ["Backup Generator", "Internet", "CCTV"],
        address: "Main Boulevard Gulberg",
        city: "Lahore",
        state: "Punjab",
        zipCode: "54660",
        country: "Pakistan",
        lat: 31.5204,
        lng: 74.3587,
        images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
        ],
        agent: "Business Hub Estate",
        owner: "Hamza Tariq",
        isFeatured: true,
        isHot: false
    },
    {
        title: "Farmhouse with Swimming Pool",
        description: "Peaceful farmhouse perfect for weekends and events.",
        propertyType: "Farmhouse",
        purpose: "Sale",
        price: 65000000,
        status: "Available",
        areaSize: 2,
        areaUnit: "Kanal",
        bedrooms: 6,
        bathrooms: 7,
        parkingSpots: 6,
        propertyAge: 4,
        amenities: ["Swimming Pool", "Garden", "Security"],
        address: "Bedian Road",
        city: "Lahore",
        state: "Punjab",
        zipCode: "54810",
        country: "Pakistan",
        lat: 31.4012,
        lng: 74.4123,
        images: [
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop"
        ],
        agent: "Royal Farms",
        owner: "Bilal Sheikh",
        isFeatured: true,
        isHot: true
    },
    {
        title: "Affordable Small House",
        description: "Budget-friendly house for small families.",
        propertyType: "House",
        purpose: "Sale",
        price: 12500000,
        status: "Available",
        areaSize: 5,
        areaUnit: "Marla",
        bedrooms: 3,
        bathrooms: 3,
        parkingSpots: 1,
        propertyAge: 8,
        amenities: ["Electricity", "Water Supply"],
        address: "Satellite Town",
        city: "Rawalpindi",
        state: "Punjab",
        zipCode: "46000",
        country: "Pakistan",
        lat: 33.6007,
        lng: 73.0679,
        images: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop"
        ],
        agent: "City Estate Agency",
        owner: "Sajid Mehmood",
        isFeatured: false,
        isHot: false
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

        // Find Mudassir Saleem
        console.log("Searching user 'Mudassir Saleem'...");
        const user = await prisma.user.findFirst({
            where: { name: { contains: "Mudassir Saleem", mode: "insensitive" } }
        });

        if (!user) {
            console.log("Searching all users in database:");
            const allUsers = await prisma.user.findMany();
            allUsers.forEach(u => console.log(`- ${u.name} (id: ${u.id})`));
            throw new Error("User Mudassir Saleem not found in the database");
        }
        console.log(`Found User: ${user.name} with ID: ${user.id}`);

        // Insert properties
        console.log(`Inserting ${propertiesToInsert.length} properties...`);
        for (const prop of propertiesToInsert) {
            const created = await prisma.property.create({
                data: {
                    title: prop.title,
                    description: prop.description,
                    propertyType: prop.propertyType,
                    purpose: prop.purpose,
                    price: Number(prop.price),
                    status: prop.status,
                    areaSize: Number(prop.areaSize),
                    areaUnit: prop.areaUnit,
                    bedrooms: prop.bedrooms,
                    bathrooms: prop.bathrooms,
                    parkingSpots: prop.parkingSpots,
                    propertyAge: prop.propertyAge,
                    amenities: prop.amenities,
                    address: prop.address,
                    city: prop.city,
                    state: prop.state,
                    zipCode: prop.zipCode,
                    country: prop.country,
                    lat: prop.lat,
                    lng: prop.lng,
                    images: prop.images,
                    agent: prop.agent,
                    owner: prop.owner,
                    isFeatured: prop.isFeatured,
                    isHot: prop.isHot,
                    userId: user.id
                }
            });
            console.log(`Inserted property: ${created.title}`);
        }
        console.log("All properties successfully inserted.");
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
