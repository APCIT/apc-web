/**
 * Seed 2 fake APC interns + timelogs in the previous pay period (for Client Timelogs testing).
 * Run: node scripts/seed-fake-apc-timelogs.mjs
 */
import "dotenv/config";
import { randomUUID } from "crypto";
import { PrismaClient } from "@prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";

const prisma = new PrismaClient({
  adapter: new PrismaMssql(process.env.DATABASE_URL),
});

function startOfWeek(d) {
  const result = new Date(d);
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
}

function previousPayPeriod(now = new Date()) {
  const weekStart = startOfWeek(now);
  const periodEnd = new Date(weekStart);
  periodEnd.setDate(periodEnd.getDate() - 7);
  const periodStart = new Date(weekStart);
  periodStart.setDate(periodStart.getDate() - 21);
  return { periodStart, periodEnd };
}

function atDay(base, dayOffset, hourUTC, minuteUTC = 0) {
  const d = new Date(base);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hourUTC, minuteUTC, 0, 0);
  return d;
}

async function ensureIntern({
  userName,
  firstName,
  lastName,
  email,
  companyId,
  cwid,
}) {
  const existing = await prisma.aspNetUsers.findFirst({
    where: { UserName: userName },
    include: { Interns: true },
  });
  if (existing?.Interns) {
    console.log(`Exists: ${userName} (${existing.Id})`);
    return existing.Id;
  }

  const internRole = await prisma.aspNetRoles.findFirst({ where: { Name: "intern" } });
  if (!internRole) throw new Error("intern role missing");

  const id = randomUUID();
  const now = new Date();
  // Fall semester marker (November)
  const semester = new Date(Date.UTC(2026, 10, 1, 0, 0, 0));

  await prisma.aspNetUsers.create({
    data: {
      Id: id,
      UserName: userName,
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      EmailConfirmed: false,
      PhoneNumberConfirmed: false,
      TwoFactorEnabled: false,
      LockoutEnabled: false,
      AccessFailedCount: 0,
      CompanyId: companyId,
      PasswordHash: null,
      SecurityStamp: randomUUID(),
    },
  });

  await prisma.aspNetUserRoles.create({
    data: { UserId: id, RoleId: internRole.Id },
  });

  await prisma.interns.create({
    data: {
      Id: id,
      CWID: cwid,
      Major: "MIS",
      Level: "Senior",
      GradDate: new Date(Date.UTC(2027, 4, 15)),
      Wage: 15,
      Semester: semester,
      Dob: new Date(Date.UTC(2003, 5, 1)),
      HoursThisWeek: 0,
    },
  });

  console.log(`Created intern ${userName} (${id})`);
  return id;
}

async function seedTimelogs(internId, periodStart, periodEnd, specs) {
  await prisma.timelogs.deleteMany({
    where: {
      Intern_Id: internId,
      Start: { gte: periodStart, lt: periodEnd },
      Description: { startsWith: "[SEED]" },
    },
  });

  for (const s of specs) {
    await prisma.timelogs.create({
      data: {
        Id: randomUUID(),
        Intern_Id: internId,
        Start: s.start,
        End: s.end,
        Lunch: s.lunch,
        Description: s.description,
      },
    });
  }
  console.log(`  + ${specs.length} timelogs for ${internId}`);
}

async function main() {
  const company = await prisma.companies.findFirst({
    where: { Name: { contains: "Alabama Productivity Center" } },
  });
  if (!company) {
    throw new Error('Company "Alabama Productivity Center" not found');
  }
  console.log(`Company: ${company.Name} (Id=${company.Id})`);

  const { periodStart, periodEnd } = previousPayPeriod();
  console.log(`Period: ${periodStart.toISOString()} → ${periodEnd.toISOString()}`);

  const aId = await ensureIntern({
    userName: "seed.jordan.lee",
    firstName: "Jordan",
    lastName: "Lee",
    email: "seed.jordan.lee@example.com",
    companyId: company.Id,
    cwid: "90010001",
  });

  const bId = await ensureIntern({
    userName: "seed.casey.nguyen",
    firstName: "Casey",
    lastName: "Nguyen",
    email: "seed.casey.nguyen@example.com",
    companyId: company.Id,
    cwid: "90010002",
  });

  // Spread fake days across the previous 2-week period (UTC wall-clock like existing logs)
  await seedTimelogs(aId, periodStart, periodEnd, [
    {
      start: atDay(periodStart, 1, 9, 0),
      end: atDay(periodStart, 1, 17, 0),
      lunch: 1,
      description: "[SEED] Onboarding docs and process mapping",
    },
    {
      start: atDay(periodStart, 3, 10, 0),
      end: atDay(periodStart, 3, 16, 30),
      lunch: 0.5,
      description: "[SEED] Excel automation for inventory report",
    },
    {
      start: atDay(periodStart, 8, 9, 0),
      end: atDay(periodStart, 8, 15, 0),
      lunch: 0,
      description: "[SEED] Client meeting notes and follow-ups",
    },
    {
      start: atDay(periodStart, 10, 8, 30),
      end: atDay(periodStart, 10, 16, 30),
      lunch: 1,
      description: "[SEED] Dashboard polish and QA",
    },
  ]);

  await seedTimelogs(bId, periodStart, periodEnd, [
    {
      start: atDay(periodStart, 2, 9, 0),
      end: atDay(periodStart, 2, 17, 0),
      lunch: 1,
      description: "[SEED] Research competitor workflows",
    },
    {
      start: atDay(periodStart, 4, 11, 0),
      end: atDay(periodStart, 4, 18, 0),
      lunch: 0.5,
      description: "[SEED] Built SOP draft for receiving",
    },
    {
      start: atDay(periodStart, 9, 9, 30),
      end: atDay(periodStart, 9, 16, 0),
      lunch: 0.5,
      description: "[SEED] Time study observations",
    },
  ]);

  console.log("Done. Refresh Client Timelogs and Send now for your APC client.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
