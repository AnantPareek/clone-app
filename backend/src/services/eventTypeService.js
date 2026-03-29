import prisma from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";

export async function listEventTypes() {
  return prisma.eventType.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getEventTypeBySlug(slug) {
  const eventType = await prisma.eventType.findUnique({
    where: { slug },
  });

  if (!eventType) {
    throw new AppError(404, "Event type not found");
  }

  return eventType;
}

export async function resolveEventType({ eventTypeId, slug }) {
  const eventType = eventTypeId
    ? await prisma.eventType.findUnique({
        where: { id: eventTypeId },
      })
    : await prisma.eventType.findUnique({
        where: { slug },
      });

  if (!eventType) {
    throw new AppError(404, "Event type not found");
  }

  return eventType;
}

export async function createEventType(data) {
  return prisma.$transaction(async (tx) => {
    const eventType = await tx.eventType.create({
      data,
    });

    const schedule = await tx.availabilitySchedule.create({
      data: {
        eventTypeId: eventType.id,
        name: "Default Schedule",
        timezone: "Asia/Kolkata",
        isDefault: true,
      },
    });

    // Create default Mon-Fri 9-5 rules
    await tx.availabilityRule.createMany({
      data: [1, 2, 3, 4, 5].map((dayOfWeek) => ({
        scheduleId: schedule.id,
        dayOfWeek,
        startTime: "09:00",
        endTime: "17:00",
      })),
    });

    return eventType;
  });
}

export async function updateEventType(id, data) {
  await resolveEventType({ eventTypeId: id });

  return prisma.eventType.update({
    where: { id },
    data,
  });
}

export async function deleteEventType(id) {
  await resolveEventType({ eventTypeId: id });

  return prisma.eventType.delete({
    where: { id },
  });
}
