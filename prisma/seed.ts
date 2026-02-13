import { config } from "dotenv";
import { PrismaClient } from "../lib/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Load environment variables
config();

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in .env file");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Clear existing data
  await prisma.announcement.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned existing data");

  // 2. Create Sample Providers (Users)
  const provider1 = await prisma.user.create({
    data: {
      id: "user_1",
      name: "Kwame Mensah",
      email: "kwame@example.com",
      phoneNumber: "+233 24 123 4567",
      location: "East Legon, Accra",
      bio: "Professional barber with 5 years of experience in modern haircuts and styling.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kwame",
    },
  });

  const provider2 = await prisma.user.create({
    data: {
      id: "user_2",
      name: "Abena Appiah",
      email: "abena@example.com",
      phoneNumber: "+233 20 987 6543",
      location: "Campus Hostels",
      bio: "Providing fast and affordable laundry services for students.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abena",
    },
  });

  const provider3 = await prisma.user.create({
    data: {
      id: "user_3",
      name: "Student Eats",
      email: "orders@studenteats.com",
      phoneNumber: "+233 55 444 3322",
      location: "Night Market Area",
      bio: "Fresh, hot meals delivered right to your hostel room.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eats",
    },
  });

  const provider4 = await prisma.user.create({
    data: {
      id: "user_4",
      name: "Bright Cleaning",
      email: "clean@bright.com",
      phoneNumber: "+233 50 111 2233",
      location: "University Residential Area",
      bio: "Dedicated cleaning services for rooms and shared spaces.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bright",
    },
  });

  const provider5 = await prisma.user.create({
    data: {
      id: "user_5",
      name: "Campus Mart",
      email: "hello@campusmart.com",
      phoneNumber: "+233 27 555 6677",
      location: "Student Center",
      bio: "One-stop shop for all your academic and personal needs.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mart",
    },
  });

  console.log("👤 Created sample providers");

  // 3. Create Sample Services
  await prisma.service.createMany({
    data: [
      {
        title: "Classic Fade & Beard Trim",
        description: "Get a sharp fade and a professional beard grooming session.",
        category: "Barbering and Salon Services",
        price: "GH₵ 50.00",
        operatingHours: "Mon-Sat: 9AM - 8PM",
        status: "Available",
        providerId: provider1.id,
      },
      {
        title: "Wash & Fold Service",
        description: "Same-day laundry service for students. We collect and deliver.",
        category: "Laundry Services",
        price: "GH₵ 30.00 / bag",
        operatingHours: "Daily: 7AM - 6PM",
        status: "Available",
        providerId: provider2.id,
      },
      {
        title: "Jollof Rice & Grilled Chicken",
        description: "Delicious Ghanaian Jollof with spicy grilled chicken and salad.",
        category: "Food Delivery Services",
        price: "GH₵ 45.00",
        operatingHours: "10AM - 10PM",
        status: "Available",
        providerId: provider3.id,
      },
      {
        title: "Hostel Room Cleaning",
        description: "Thorough cleaning of your hostel room, including windows and floors.",
        category: "Cleaning Services",
        price: "GH₵ 70.00",
        operatingHours: "Weekends: 8AM - 4PM",
        status: "Available",
        providerId: provider4.id,
      },
      {
        title: "Essential Stationery Bundle",
        description: "Includes notebooks, pens, highlighters, and folders.",
        category: "Shops for student needs",
        price: "GH₵ 120.00",
        operatingHours: "Mon-Fri: 8AM - 8PM",
        status: "Available",
        providerId: provider5.id,
      },
      {
        title: "Ladies Braiding & Styling",
        description: "Professional braiding services right at your hostel.",
        category: "Barbering and Salon Services",
        price: "GH₵ 150.00+",
        operatingHours: "By Appointment",
        status: "Available",
        providerId: provider1.id, // Using provider1 as a general salon/barber for demo
      },
    ],
  });

  console.log("🛠️ Created sample services");

  // 4. Create Sample Announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: "SRC Presidential Scholarship 2026",
        summary: "Applications are now open for the annual SRC merit-based scholarship.",
        content: `The Student Representative Council is proud to announce the opening of applications for the 2026 Presidential Scholarship.

Eligibility:
- Must be a full-time student
- Minimum GPA of 3.5
- Demonstrated leadership skills

Benefits:
- Full tuition coverage for one academic year
- Book allowance of GH₵ 2,000
- Mentorship opportunity

Deadline: March 30, 2026`,
        category: "Scholarships",
        isVerified: true,
        isActive: true,
        contactInfo: "scholarships@src.edu",
      },
      {
        title: "Upcoming Tuition Payment Deadline",
        summary: "Final deadline for Spring 2026 tuition fees is approaching.",
        content: `Please be reminded that the final deadline for the payment of tuition fees for the Spring 2026 semester is February 25, 2026.

Late payment will attract a penalty fee of GH₵ 200. Please ensure all payments are made through the approved bank channels or the student portal.`,
        category: "Tuition",
        isVerified: true,
        isActive: true,
      },
      {
        title: "Tech Innovation Expo 2026",
        summary: "Showcase your tech projects at the annual innovation fair.",
        content: `Join us for the Tech Innovation Expo! Register your teams to exhibit your software and hardware projects. Prizes worth GH₵ 10,000 to be won.`,
        category: "Events",
        isVerified: true,
        isActive: true,
        externalLink: "https://expo.university.edu",
      },
      {
        title: "Software Engineering Internships at MTN",
        summary: "MTN Ghana is hiring interns for their IT and Engineering departments.",
        content: `Apply for a 3-month summer internship at MTN Ghana. Gain hands-on experience in telecommunications and software development.`,
        category: "Internships",
        isVerified: true,
        isActive: true,
        externalLink: "https://mtn.com.gh/careers",
      },
      {
        title: "Course Registration Extension",
        summary: "Deadline for course registration has been extended by one week.",
        content: `By popular demand, the Academic Board has approved an extension of the course registration deadline to February 20, 2026.`,
        category: "Deadlines",
        isVerified: true,
        isActive: true,
      },
    ],
  });

  console.log("📢 Created sample announcements");
  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });