import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { localDateTimeToUtc } from "../src/utils/time.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

function createUtcDateTime(date, time, timezone) {
  const utcDate = localDateTimeToUtc(date, time, timezone);

  if (!utcDate) {
    throw new Error(`Could not convert ${date} ${time} in ${timezone} to UTC`);
  }

  return utcDate;
}

async function resetEventTypeSchedule(eventTypeId, { name, timezone, rules, dateOverrides = [] }) {
  await prisma.booking.deleteMany({
    where: {
      eventTypeId,
    },
  });

  await prisma.availabilitySchedule.deleteMany({
    where: {
      eventTypeId,
    },
  });

  return prisma.availabilitySchedule.create({
    data: {
      eventTypeId,
      name,
      timezone,
      isDefault: true,
      rules: {
        create: rules,
      },
      dateOverrides: {
        create: dateOverrides.map((override) => ({
          date: new Date(`${override.date}T00:00:00.000Z`),
          startTime: override.startTime ?? null,
          endTime: override.endTime ?? null,
          isUnavailable: override.isUnavailable ?? false,
        })),
      },
    },
  });
}

async function createSeedBooking({
  eventTypeId,
  timezone,
  date,
  startTime,
  endTime,
  name,
  email,
  status = "booked",
  cancellationReason = null,
}) {
  const startAt = createUtcDateTime(date, startTime, timezone);
  const endAt = createUtcDateTime(date, endTime, timezone);

  return prisma.booking.create({
    data: {
      eventTypeId,
      startAt,
      endAt,
      timezone,
      name,
      email,
      status,
      cancelledAt: status === "cancelled" ? new Date() : null,
      cancellationReason,
    },
  });
}

async function main() {
  const introCall = await prisma.eventType.upsert({
    where: {
      slug: "intro-call",
    },
    update: {
      title: "Intro Call",
      description: "Default seeded event type",
      duration: 30,
    },
    create: {
      title: "Intro Call",
      description: "Default seeded event type",
      duration: 30,
      slug: "intro-call",
    },
  });

  const strategySession = await prisma.eventType.upsert({
    where: {
      slug: "strategy-session",
    },
    update: {
      title: "Strategy Session",
      description: "A deeper seeded consultation event type",
      duration: 60,
    },
    create: {
      title: "Strategy Session",
      description: "A deeper seeded consultation event type",
      duration: 60,
      slug: "strategy-session",
    },
  });

  await resetEventTypeSchedule(introCall.id, {
    name: "Default Schedule",
    timezone: "Asia/Kolkata",
    rules: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "12:00" },
      { dayOfWeek: 3, startTime: "14:00", endTime: "17:00" },
    ],
    dateOverrides: [
      {
        date: "2026-04-08",
        isUnavailable: true,
      },
    ],
  });

  await resetEventTypeSchedule(strategySession.id, {
    name: "Default Schedule",
    timezone: "America/New_York",
    rules: [
      { dayOfWeek: 2, startTime: "10:00", endTime: "13:00" },
      { dayOfWeek: 4, startTime: "15:00", endTime: "18:00" },
    ],
    dateOverrides: [
      {
        date: "2026-04-09",
        startTime: "12:00",
        endTime: "14:00",
      },
    ],
  });

  await createSeedBooking({
    eventTypeId: introCall.id,
    timezone: "Asia/Kolkata",
    date: "2026-04-06",
    startTime: "09:00",
    endTime: "09:30",
    name: "Aditi Rao",
    email: "aditi@example.com",
  });

  await createSeedBooking({
    eventTypeId: introCall.id,
    timezone: "Asia/Kolkata",
    date: "2026-03-18",
    startTime: "14:00",
    endTime: "14:30",
    name: "Rahul Singh",
    email: "rahul@example.com",
    status: "cancelled",
    cancellationReason: "Seeded cancellation example",
  });

  await createSeedBooking({
    eventTypeId: strategySession.id,
    timezone: "America/New_York",
    date: "2026-04-07",
    startTime: "10:00",
    endTime: "11:00",
    name: "Morgan Lee",
    email: "morgan@example.com",
  });

  console.log("Seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
