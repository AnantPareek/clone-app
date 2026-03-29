import prisma from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";
import { dateStringToStoredDate, storedDateToDateString, timeToMinutes } from "../utils/time.js";
import { resolveEventType } from "./eventTypeService.js";

function normalizeSchedule(eventType, schedule) {
  return {
    eventType: {
      id: eventType.id,
      title: eventType.title,
      slug: eventType.slug,
      duration: eventType.duration,
    },
    schedule: schedule
      ? {
          id: schedule.id,
          name: schedule.name,
          isDefault: schedule.isDefault,
          createdAt: schedule.createdAt,
          updatedAt: schedule.updatedAt,
        }
      : null,
    timezone: schedule?.timezone ?? null,
    rules: (schedule?.rules ?? []).map((rule) => ({
      id: rule.id,
      dayOfWeek: rule.dayOfWeek,
      startTime: rule.startTime,
      endTime: rule.endTime,
      timezone: schedule.timezone,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt,
    })),
    dateOverrides: (schedule?.dateOverrides ?? []).map((override) => ({
      id: override.id,
      date: storedDateToDateString(override.date),
      startTime: override.startTime,
      endTime: override.endTime,
      isUnavailable: override.isUnavailable,
      timezone: schedule.timezone,
      createdAt: override.createdAt,
      updatedAt: override.updatedAt,
    })),
  };
}

function assertNoOverlap(rules) {
  const sortedRules = [...rules].sort((left, right) => {
    if (left.dayOfWeek !== right.dayOfWeek) {
      return left.dayOfWeek - right.dayOfWeek;
    }

    return timeToMinutes(left.startTime) - timeToMinutes(right.startTime);
  });

  for (let index = 1; index < sortedRules.length; index += 1) {
    const previous = sortedRules[index - 1];
    const current = sortedRules[index];

    if (
      previous.dayOfWeek === current.dayOfWeek &&
      timeToMinutes(previous.endTime) > timeToMinutes(current.startTime)
    ) {
      throw new AppError(
        409,
        `Availability rules overlap on day ${current.dayOfWeek}`
      );
    }
  }
}

function assertNoDateOverrideConflicts(dateOverrides) {
  const groupedOverrides = new Map();

  for (const override of dateOverrides) {
    const group = groupedOverrides.get(override.date) ?? [];
    group.push(override);
    groupedOverrides.set(override.date, group);
  }

  for (const [date, overrides] of groupedOverrides.entries()) {
    const blockedDate = overrides.find((override) => override.isUnavailable);

    if (blockedDate) {
      if (overrides.length > 1) {
        throw new AppError(
          409,
          `Date override for ${date} cannot mix an unavailable day with custom windows`
        );
      }

      continue;
    }

    const sortedOverrides = [...overrides].sort(
      (left, right) => timeToMinutes(left.startTime) - timeToMinutes(right.startTime)
    );

    for (let index = 1; index < sortedOverrides.length; index += 1) {
      const previous = sortedOverrides[index - 1];
      const current = sortedOverrides[index];

      if (timeToMinutes(previous.endTime) > timeToMinutes(current.startTime)) {
        throw new AppError(409, `Date override windows overlap on ${date}`);
      }
    }
  }
}

export async function getDefaultScheduleRecord(eventTypeId) {
  return prisma.availabilitySchedule.findFirst({
    where: {
      eventTypeId,
      isDefault: true,
    },
    include: {
      rules: {
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
      dateOverrides: {
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getAvailabilitySchedule(selector) {
  const eventType = await resolveEventType(selector);
  const schedule = await getDefaultScheduleRecord(eventType.id);

  return normalizeSchedule(eventType, schedule);
}

export async function createAvailabilityRule(data) {
  const eventType = await resolveEventType({ eventTypeId: data.eventTypeId });
  let schedule = await getDefaultScheduleRecord(data.eventTypeId);

  if (!schedule) {
    schedule = await prisma.availabilitySchedule.create({
      data: {
        eventTypeId: data.eventTypeId,
        name: "Default Schedule",
        timezone: data.timezone,
        isDefault: true,
      },
      include: {
        rules: {
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        },
        dateOverrides: {
          orderBy: [{ date: "asc" }, { startTime: "asc" }],
        },
      },
    });
  }

  if (schedule.timezone !== data.timezone) {
    throw new AppError(
      409,
      "The default schedule already exists with a different timezone"
    );
  }

  assertNoOverlap([
    ...schedule.rules.filter((rule) => rule.dayOfWeek === data.dayOfWeek),
    data,
  ]);

  await prisma.availabilityRule.create({
    data: {
      scheduleId: schedule.id,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
    },
  });

  return getAvailabilitySchedule({ eventTypeId: eventType.id });
}

export async function replaceAvailabilitySchedule({
  eventTypeId,
  timezone,
  scheduleName,
  rules,
  dateOverrides,
}) {
  const eventType = await resolveEventType({ eventTypeId });
  assertNoOverlap(rules);
  assertNoDateOverrideConflicts(dateOverrides);

  let schedule = await getDefaultScheduleRecord(eventTypeId);

  if (!schedule) {
    schedule = await prisma.availabilitySchedule.create({
      data: {
        eventTypeId,
        name: scheduleName,
        timezone,
        isDefault: true,
      },
      include: {
        rules: true,
        dateOverrides: true,
      },
    });
  }

  await prisma.$transaction([
    prisma.availabilitySchedule.update({
      where: {
        id: schedule.id,
      },
      data: {
        name: scheduleName,
        timezone,
        isDefault: true,
      },
    }),
    prisma.availabilityRule.deleteMany({
      where: {
        scheduleId: schedule.id,
      },
    }),
    prisma.dateOverride.deleteMany({
      where: {
        scheduleId: schedule.id,
      },
    }),
    prisma.availabilityRule.createMany({
      data: rules.map((rule) => ({
        scheduleId: schedule.id,
        dayOfWeek: rule.dayOfWeek,
        startTime: rule.startTime,
        endTime: rule.endTime,
      })),
    }),
    prisma.dateOverride.createMany({
      data: dateOverrides.map((override) => ({
        scheduleId: schedule.id,
        date: dateStringToStoredDate(override.date),
        startTime: override.startTime,
        endTime: override.endTime,
        isUnavailable: override.isUnavailable,
      })),
    }),
  ]);

  const freshSchedule = await getDefaultScheduleRecord(eventTypeId);

  return normalizeSchedule(eventType, freshSchedule);
}
