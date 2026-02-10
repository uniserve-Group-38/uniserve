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

  // Clear existing announcements
  await prisma.announcement.deleteMany();

  // Create sample announcements
  const announcements = await prisma.announcement.createMany({
    data: [
      {
        title: "Google Summer Internship 2026 - Applications Open",
        summary: "Apply now for Google's prestigious summer internship program for software engineering students.",
        content: `Google is now accepting applications for the Summer 2026 Software Engineering Internship program!

This is an excellent opportunity to work on real-world projects alongside some of the best engineers in the industry. You'll contribute to products used by billions of people worldwide.

Program Details:
- Duration: 12 weeks (June - August 2026)
- Location: Multiple offices worldwide
- Compensation: Competitive salary + housing stipend
- Requirements: Currently enrolled in CS/related program

What you'll do:
- Work on cutting-edge technology projects
- Collaborate with experienced engineers
- Participate in tech talks and networking events
- Present your project to leadership at the end

Application deadline: March 15, 2026`,
        category: "Internships",
        isVerified: true,
        isActive: true,
        externalLink: "https://careers.google.com/students",
        contactInfo: "internships@google.com",
      },
      {
        title: "Campus Tech Fest 2026 - Register Your Team",
        summary: "Annual hackathon and tech exhibition. Win prizes worth $10,000! Registration closes Feb 20.",
        content: `Get ready for the biggest tech event of the year! Campus Tech Fest 2026 is here.

Event Highlights:
🏆 24-hour Hackathon
🎤 Keynote speakers from top tech companies
💰 Prize pool: $10,000
🤝 Networking opportunities with industry professionals
🎨 Tech workshops and exhibitions

Date: March 5-6, 2026
Venue: Main Auditorium & Computer Labs
Registration Fee: Free for students

Categories:
- Web Development
- Mobile Apps
- AI/ML Projects
- Hardware/IoT

Don't miss this opportunity to showcase your skills and connect with potential employers!`,
        category: "Events",
        isVerified: true,
        isActive: true,
        externalLink: "https://campustechfest.edu/register",
        contactInfo: "techfest@university.edu",
      },
      {
        title: "Mid-Semester Exam Schedule Released",
        summary: "Mid-semester examinations will be held from February 24-28. Check the full timetable.",
        content: `The mid-semester examination schedule for Spring 2026 has been released.

Important Dates:
📅 Exam Period: February 24-28, 2026
📋 Hall tickets available: February 17, 2026
📚 Reading week: February 17-23, 2026

Key Points:
- All exams will be held in offline mode
- Students must carry their ID cards and hall tickets
- Electronic devices are strictly prohibited
- Arrive 30 minutes before the exam starts

Check the student portal for your personalized timetable and assigned exam halls.

For any queries regarding the exam schedule, contact the Examinations Office.`,
        category: "Academic",
        isVerified: true,
        isActive: true,
        contactInfo: "exams@university.edu",
      },
      {
        title: "New Cafeteria Hours - Effective Immediately",
        summary: "Campus cafeteria extends evening hours. Now open until 10 PM on weekdays.",
        content: `Great news for night owls and late studiers!

The main campus cafeteria has extended its operating hours to better serve students.

New Timings:
Monday - Friday: 7:00 AM - 10:00 PM
Saturday - Sunday: 8:00 AM - 9:00 PM

What's new:
✅ Late-night snack menu (8 PM - 10 PM)
✅ Extended coffee and beverage service
✅ Study-friendly seating area
✅ Free WiFi throughout

The extension is based on student feedback from last semester. We hope this helps you balance your academic and personal schedules better!`,
        category: "Campus News",
        isVerified: true,
        isActive: true,
      },
      {
        title: "Career Fair 2026 - Meet Top Employers",
        summary: "50+ companies hiring for internships and full-time roles. February 18, 9 AM - 5 PM.",
        content: `Mark your calendars! The Annual Career Fair is back.

Participating Companies:
- Microsoft, Amazon, Meta, Apple
- Goldman Sachs, JP Morgan, McKinsey
- Startup founders and local businesses
- NGOs and research organizations

What to expect:
📝 On-spot resume reviews
🎯 Mock interviews
💼 Job/internship opportunities
🎓 Career counseling sessions

How to prepare:
1. Update your resume
2. Research participating companies
3. Prepare your elevator pitch
4. Dress professionally
5. Bring multiple copies of your resume

Registration is mandatory. Visit the Career Services Office or register online by February 15.`,
        category: "Events",
        isVerified: true,
        isActive: true,
        externalLink: "https://careers.university.edu/fair2026",
        contactInfo: "careers@university.edu",
      },
    ],
  });

  console.log(`✅ Created ${announcements.count} announcements`);
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