import prisma from "../lib/prisma.js";
import {
  addMinutes,
  getDayOfWeek,
  getUtcRangeForLocalDate,
  localDateTimeToUtc,
  timeToMinutes,
} from "../utils/time.js";
import { getDefaultScheduleRecord } from "./availabilityService.js";
import { resolveEventType } from "./eventTypeService.js";

function overlapsWithBooking(bookings, slotStartAt, slotEndAt) {
  return bookings.some((booking) => {
    return booking.startAt < slotEndAt && booking.endAt > slotStartAt;
  });
}

export async function getAvailableSlots({ eventTypeId, slug, date }) {
  const eventType = await resolveEventType({ eventTypeId, slug });
  const schedule = await getDefaultScheduleRecord(eventType.id);

  if (!schedule) {
    return {
      eventType: {
        id: eventType.id,
        title: eventType.title,
        slug: eventType.slug,
        duration: eventType.duration,
        description: eventType.description,
      },
      date,
      timezone: null,
      slots: [],
    };
  }

  const matchingOverrides = schedule.dateOverrides.filter(
    (override) => override.date.toISOString().slice(0, 10) === date
  );

  if (matchingOverrides.some((override) => override.isUnavailable)) {
    return {
      eventType: {
        id: eventType.id,
        title: eventType.title,
        slug: eventType.slug,
        duration: eventType.duration,
        description: eventType.description,
      },
      date,
      timezone: schedule.timezone,
      slots: [],
    };
  }

  const dayOfWeek = getDayOfWeek(date);
  const activeWindows = matchingOverrides.length > 0
    ? matchingOverrides
    : schedule.rules.filter((rule) => rule.dayOfWeek === dayOfWeek);
  const { startAt: dayStartAt, endAt: dayEndAt } = getUtcRangeForLocalDate(
    date,
    schedule.timezone
  );

  const bookings = await prisma.booking.findMany({
    where: {
      eventTypeId: eventType.id,
      status: {
        not: "cancelled",
      },
      startAt: {
        lt: dayEndAt,
      },
      endAt: {
        gt: dayStartAt,
      },
    },
    orderBy: {
      startAt: "asc",
    },
  });

  const slotMap = new Map();

  for (const window of activeWindows) {
    let pointer = timeToMinutes(window.startTime);
    const endMinutes = timeToMinutes(window.endTime);

    while (pointer + eventType.duration <= endMinutes) {
      const startTime = `${String(Math.floor(pointer / 60)).padStart(2, "0")}:${String(pointer % 60).padStart(2, "0")}`;
      const endTime = addMinutes(startTime, eventType.duration);
      const startAt = localDateTimeToUtc(date, startTime, schedule.timezone);
      const endAt = localDateTimeToUtc(date, endTime, schedule.timezone);

      if (startAt && endAt && !overlapsWithBooking(bookings, startAt, endAt)) {
        slotMap.set(startAt.toISOString(), {
          startTime,
          endTime,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          timezone: schedule.timezone,
        });
      }

      pointer += eventType.duration;
    }
  }

  const slots = [...slotMap.values()].sort((left, right) =>
    left.startAt.localeCompare(right.startAt)
  );

  return {
    eventType: {
      id: eventType.id,
      title: eventType.title,
      slug: eventType.slug,
      duration: eventType.duration,
      description: eventType.description,
    },
    date,
    timezone: schedule.timezone,
    slots,
  };
}
