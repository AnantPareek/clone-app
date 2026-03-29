import { Prisma } from "@prisma/client";

import prisma from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";
import {
  dateStringToStoredDate,
  formatUtcInTimeZone,
  localDateTimeToUtc,
  storedDateToDateString,
} from "../utils/time.js";
import { resolveEventType } from "./eventTypeService.js";
import { getAvailableSlots } from "./slotService.js";

function getBookingTimezone(booking) {
  return booking.timezone ?? "UTC";
}

function serializeBooking(booking) {
  const timezone = getBookingTimezone(booking);
  const startLocal = formatUtcInTimeZone(booking.startAt, timezone);
  const endLocal = formatUtcInTimeZone(booking.endAt, timezone);
  const startsInPast = booking.startAt.getTime() < Date.now();

  return {
    id: booking.id,
    date: startLocal.date,
    startTime: startLocal.time,
    endTime: endLocal.time,
    startAt: booking.startAt.toISOString(),
    endAt: booking.endAt.toISOString(),
    timezone,
    status: booking.status,
    cancelledAt: booking.cancelledAt?.toISOString() ?? null,
    cancellationReason: booking.cancellationReason,
    name: booking.name,
    email: booking.email,
    responses: booking.responses ?? {},
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    temporalStatus: startsInPast ? "past" : "upcoming",
    eventType: {
      id: booking.eventType.id,
      title: booking.eventType.title,
      slug: booking.eventType.slug,
      duration: booking.eventType.duration,
    },
  };
}

export async function listBookings({ eventTypeId, status }) {
  const where = {};

  if (eventTypeId) {
    where.eventTypeId = eventTypeId;
  }

  if (status === "booked" || status === "cancelled") {
    where.status = status;
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      eventType: true,
    },
    orderBy: [{ startAt: "asc" }],
  });

  let serialized = bookings.map(serializeBooking);

  if (status === "upcoming" || status === "past") {
    serialized = serialized.filter((booking) => {
      if (booking.status === "cancelled") {
        return false;
      }

      return booking.temporalStatus === status;
    });
  }

  return serialized;
}

export async function createBooking(input) {
  const eventType = await resolveEventType({
    eventTypeId: input.eventTypeId,
    slug: input.slug,
  });

  const availableSlots = await getAvailableSlots({
    eventTypeId: eventType.id,
    date: input.date,
  });

  const selectedSlot = availableSlots.slots.find((slot) => {
    if (slot.startTime !== input.startTime) {
      return false;
    }

    if (!input.timezone) {
      return true;
    }

    return slot.timezone === input.timezone;
  });

  if (!selectedSlot) {
    throw new AppError(409, "Requested slot is not available");
  }

  let booking;

  try {
    booking = await prisma.booking.create({
      data: {
        eventTypeId: eventType.id,
        startAt: new Date(selectedSlot.startAt),
        endAt: new Date(selectedSlot.endAt),
        timezone: selectedSlot.timezone,
        name: input.name,
        email: input.email,
        responses: input.responses ?? {},
        status: "booked",
      },
      include: {
        eventType: true,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(409, "Requested slot is not available");
    }

    throw error;
  }

  return serializeBooking(booking);
}

export async function cancelBooking(id, { cancellationReason } = {}) {
  const existing = await prisma.booking.findUnique({
    where: { id },
    include: {
      eventType: true,
    },
  });

  if (!existing) {
    throw new AppError(404, "Booking not found");
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: "cancelled",
      cancelledAt: existing.cancelledAt ?? new Date(),
      cancellationReason: cancellationReason ?? existing.cancellationReason,
    },
    include: {
      eventType: true,
    },
  });

  return serializeBooking(booking);
}
