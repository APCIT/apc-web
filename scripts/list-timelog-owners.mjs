import "dotenv/config";
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

async function main() {
  const { periodStart, periodEnd } = previousPayPeriod();
  console.log(
    `Previous pay period: ${periodStart.toLocaleDateString()} → ${new Date(periodEnd.getTime() - 1).toLocaleDateString()}`
  );

  const periodLogs = await prisma.timelogs.findMany({
    where: { Start: { gte: periodStart, lt: periodEnd } },
    include: {
      Interns: {
        include: {
          AspNetUsers: { include: { Companies: true } },
        },
      },
    },
  });

  const byIntern = new Map();
  for (const t of periodLogs) {
    const id = t.Intern_Id ?? "?";
    const u = t.Interns?.AspNetUsers;
    const key = id;
    if (!byIntern.has(key)) {
      byIntern.set(key, {
        name: `${u?.LastName ?? "?"}, ${u?.FirstName ?? "?"}`,
        userName: u?.UserName ?? "",
        company: u?.Companies?.Name ?? "",
        count: 0,
        seed: 0,
      });
    }
    const row = byIntern.get(key);
    row.count += 1;
    if ((t.Description ?? "").startsWith("[SEED]")) row.seed += 1;
  }

  const rows = [...byIntern.values()].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  console.log(`\nInterns with timelogs in previous pay period: ${rows.length}`);
  for (const r of rows) {
    console.log(
      `  ${r.name} (${r.userName}) — ${r.company} — ${r.count} log(s)${r.seed ? ` [${r.seed} seeded]` : ""}`
    );
  }

  const total = await prisma.timelogs.count();
  const distinct = await prisma.timelogs.groupBy({
    by: ["Intern_Id"],
    _count: { _all: true },
  });
  console.log(`\nAll-time: ${total} timelog rows across ${distinct.length} intern(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
