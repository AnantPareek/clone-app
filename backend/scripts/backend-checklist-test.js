import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const baseUrl = process.env.TEST_BASE_URL ?? "http://127.0.0.1:5001/api";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function request(method, path, body, headers = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...headers,
      ...(body ? { "content-type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return {
    status: response.status,
    data,
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function cleanupTempData(tempSlugPrefix) {
  const eventTypes = await prisma.eventType.findMany({
    where: {
      slug: {
        startsWith: tempSlugPrefix,
      },
    },
  });

  for (const eventType of eventTypes) {
    await prisma.eventType.delete({
      where: {
        id: eventType.id,
      },
    });
  }
}

async function main() {
  const results = [];
  const tempSlugPrefix = "checklist-temp-";
  const tempSlug = `${tempSlugPrefix}${Date.now()}`;
  const updatedSlug = `${tempSlug}-updated`;
  const dstSlug = `${tempSlug}-dst`;
  let tempEventTypeId = null;
  let tempBookingId = null;
  let pastBookingId = null;
  let tempCascadeEventTypeId = null;
  let cascadeBookingId = null;
  let dstEventTypeId = null;

  try {
    await cleanupTempData(tempSlugPrefix);

    const health = await request("GET", "/health");
    assert(health.status === 200, "GET /health should return 200");
    results.push(["GET /api/health", "pass"]);

    const listEventTypes = await request("GET", "/event-types");
    assert(listEventTypes.status === 200, "GET /event-types should return 200");
    results.push(["GET /api/event-types", "pass"]);

    const createEventType = await request("POST", "/event-types", {
      title: "Checklist Temp Event",
      description: "Automated backend checklist",
      duration: 30,
      slug: tempSlug,
    });
    assert(createEventType.status === 201, "POST /event-types should return 201");
    tempEventTypeId = createEventType.data.id;
    results.push(["POST /api/event-types", "pass"]);

    const getEventType = await request("GET", `/event-types/${tempSlug}`);
    assert(getEventType.status === 200, "GET /event-types/:slug should return 200");
    results.push(["GET /api/event-types/:slug", "pass"]);

    const updateEventType = await request("PUT", `/event-types/${tempEventTypeId}`, {
      title: "Checklist Temp Event Updated",
      description: "Automated backend checklist update",
      duration: 45,
      slug: updatedSlug,
    });
    assert(updateEventType.status === 200, "PUT /event-types/:id should return 200");
    results.push(["PUT /api/event-types/:id", "pass"]);

    const invalidEventType = await request("POST", "/event-types", {
      title: "",
      description: "Invalid",
      duration: 30,
      slug: "bad slug",
    });
    assert(invalidEventType.status === 400, "Invalid event type payload should return 400");
    results.push(["POST /api/event-types invalid payload", "pass"]);

    const duplicateEventType = await request("POST", "/event-types", {
      title: "Duplicate",
      description: "Duplicate slug",
      duration: 30,
      slug: updatedSlug,
    });
    assert(duplicateEventType.status === 409, "Duplicate slug should return 409");
    results.push(["POST /api/event-types duplicate slug", "pass"]);

    const missingEventType = await request("GET", "/event-types/does-not-exist");
    assert(missingEventType.status === 404, "Missing event type slug should return 404");
    results.push(["GET /api/event-types/:slug missing", "pass"]);

    const replaceAvailability = await request("PUT", "/availability", {
      eventTypeId: tempEventTypeId,
      timezone: "Asia/Kolkata",
      scheduleName: "Checklist Default Schedule",
      rules: [
        { dayOfWeek: 1, startTime: "09:00", endTime: "12:00" },
        { dayOfWeek: 3, startTime: "14:00", endTime: "16:00" },
      ],
      dateOverrides: [
        { date: "2026-03-31", isUnavailable: true },
        { date: "2026-04-02", startTime: "13:00", endTime: "14:30" },
      ],
    });
    assert(replaceAvailability.status === 200, "PUT /availability should return 200");
    assert(replaceAvailability.data.rules.length === 2, "Availability replace should return 2 rules");
    assert(replaceAvailability.data.dateOverrides.length === 2, "Availability replace should return 2 date overrides");
    results.push(["PUT /api/availability", "pass"]);

    const createAvailability = await request("POST", "/availability", {
      eventTypeId: tempEventTypeId,
      dayOfWeek: 5,
      startTime: "10:00",
      endTime: "11:30",
      timezone: "Asia/Kolkata",
    });
    assert(createAvailability.status === 201, "POST /availability should return 201");
    assert(createAvailability.data.rules.length === 3, "Availability create should return full schedule");
    results.push(["POST /api/availability", "pass"]);

    const getAvailability = await request("GET", `/availability?eventTypeId=${tempEventTypeId}`);
    assert(getAvailability.status === 200, "GET /availability should return 200");
    assert(getAvailability.data.rules.length === 3, "Availability query should return 3 rules");
    assert(getAvailability.data.dateOverrides.length === 2, "Availability query should return 2 date overrides");
    results.push(["GET /api/availability", "pass"]);

    const overlappingAvailability = await request("POST", "/availability", {
      eventTypeId: tempEventTypeId,
      dayOfWeek: 1,
      startTime: "11:00",
      endTime: "13:00",
      timezone: "Asia/Kolkata",
    });
    assert(overlappingAvailability.status === 409, "Overlapping availability should return 409");
    results.push(["POST /api/availability overlap", "pass"]);

    const invalidDayAvailability = await request("POST", "/availability", {
      eventTypeId: tempEventTypeId,
      dayOfWeek: 8,
      startTime: "09:00",
      endTime: "10:00",
      timezone: "Asia/Kolkata",
    });
    assert(invalidDayAvailability.status === 400, "Invalid dayOfWeek should return 400");
    results.push(["POST /api/availability invalid dayOfWeek", "pass"]);

    const invalidWindowAvailability = await request("POST", "/availability", {
      eventTypeId: tempEventTypeId,
      dayOfWeek: 2,
      startTime: "12:00",
      endTime: "11:00",
      timezone: "Asia/Kolkata",
    });
    assert(invalidWindowAvailability.status === 400, "Invalid time window should return 400");
    results.push(["POST /api/availability invalid window", "pass"]);

    const invalidTimezoneAvailability = await request("PUT", "/availability", {
      eventTypeId: tempEventTypeId,
      timezone: "Invalid/Zone",
      rules: [{ dayOfWeek: 2, startTime: "09:00", endTime: "11:00" }],
    });
    assert(invalidTimezoneAvailability.status === 400, "Invalid timezone should return 400");
    results.push(["PUT /api/availability invalid timezone", "pass"]);

    const blockedDateSlots = await request("GET", `/bookings/slots?slug=${updatedSlug}&date=2026-03-31`);
    assert(blockedDateSlots.status === 200, "Blocked date slot query should return 200");
    assert(blockedDateSlots.data.slots.length === 0, "Blocked date override should remove all slots");
    results.push(["GET /api/bookings/slots blocked date override", "pass"]);

    const customOverrideSlots = await request("GET", `/bookings/slots?slug=${updatedSlug}&date=2026-04-02`);
    assert(customOverrideSlots.status === 200, "Custom override slot query should return 200");
    assert(customOverrideSlots.data.slots.map((slot) => slot.startTime).join(",") === "13:00,13:45", "Custom override should replace weekly availability for that date");
    results.push(["GET /api/bookings/slots custom date override", "pass"]);

    const detailedSlots = await request("GET", `/bookings/slots?slug=${updatedSlug}&date=2026-03-30`);
    assert(detailedSlots.status === 200, "GET /bookings/slots should return 200");
    assert(detailedSlots.data.slots.length === 4, "45-minute slots from 09:00-12:00 should produce 4 slots");
    assert(detailedSlots.data.slots.map((slot) => slot.startTime).join(",") === "09:00,09:45,10:30,11:15", "Slot generation should honor duration");
    results.push(["GET /api/bookings/slots", "pass"]);

    const legacySlots = await request("GET", `/slots?slug=${updatedSlug}&date=2026-03-30`);
    assert(legacySlots.status === 200, "GET /slots should return 200");
    assert(legacySlots.data.join(",") === "09:00,09:45,10:30,11:15", "Legacy slots route should mirror detailed slots");
    results.push(["GET /api/slots", "pass"]);

    const invalidSlotQuery = await request("GET", "/bookings/slots?slug=bad-slug");
    assert(invalidSlotQuery.status === 400, "Missing date in slot query should return 400");
    results.push(["GET /api/bookings/slots invalid query", "pass"]);

    const createBooking = await request("POST", "/bookings", {
      slug: updatedSlug,
      date: "2026-03-30",
      startTime: "09:00",
      name: "Checklist Booker",
      email: "checklist@example.com",
    });
    assert(createBooking.status === 201, "POST /bookings should return 201");
    tempBookingId = createBooking.data.id;
    results.push(["POST /api/bookings", "pass"]);

    const duplicateBooking = await request("POST", "/bookings", {
      slug: updatedSlug,
      date: "2026-03-30",
      startTime: "09:00",
      name: "Checklist Booker Duplicate",
      email: "checklist-duplicate@example.com",
    });
    assert(duplicateBooking.status === 409, "Duplicate booking should return 409");
    results.push(["POST /api/bookings duplicate", "pass"]);

    const invalidNameBooking = await request("POST", "/bookings", {
      slug: updatedSlug,
      date: "2026-03-30",
      startTime: "09:45",
      name: "",
      email: "invalid-name@example.com",
    });
    assert(invalidNameBooking.status === 400, "Missing booking name should return 400");
    results.push(["POST /api/bookings invalid name", "pass"]);

    const invalidEmailBooking = await request("POST", "/bookings", {
      slug: updatedSlug,
      date: "2026-03-30",
      startTime: "09:45",
      name: "Invalid Email",
      email: "not-an-email",
    });
    assert(invalidEmailBooking.status === 400, "Invalid email should return 400");
    results.push(["POST /api/bookings invalid email", "pass"]);

    const missingEventBooking = await request("POST", "/bookings", {
      slug: "does-not-exist",
      date: "2026-03-30",
      startTime: "09:45",
      name: "Missing Event",
      email: "missing@example.com",
    });
    assert(missingEventBooking.status === 404, "Unknown event type for booking should return 404");
    results.push(["POST /api/bookings unknown slug", "pass"]);

    const upcomingBookings = await request("GET", "/bookings?status=upcoming");
    assert(upcomingBookings.status === 200, "GET /bookings?status=upcoming should return 200");
    assert(upcomingBookings.data.some((booking) => booking.id === tempBookingId), "Upcoming bookings should contain the new booking");
    results.push(["GET /api/bookings?status=upcoming", "pass"]);

    const allBookings = await request("GET", "/bookings?status=all");
    assert(allBookings.status === 200, "GET /bookings?status=all should return 200");
    results.push(["GET /api/bookings?status=all", "pass"]);

    const bookedBookings = await request("GET", "/bookings?status=booked");
    assert(bookedBookings.status === 200, "GET /bookings?status=booked should return 200");
    results.push(["GET /api/bookings?status=booked", "pass"]);

    const cancelledBookings = await request("GET", "/bookings?status=cancelled");
    assert(cancelledBookings.status === 200, "GET /bookings?status=cancelled should return 200");
    results.push(["GET /api/bookings?status=cancelled", "pass"]);

    const invalidBookingFilter = await request("GET", "/bookings?status=wrong");
    assert(invalidBookingFilter.status === 400, "Invalid booking filter should return 400");
    results.push(["GET /api/bookings invalid status", "pass"]);

    const slotsAfterBooking = await request("GET", `/bookings/slots?slug=${updatedSlug}&date=2026-03-30`);
    assert(!slotsAfterBooking.data.slots.some((slot) => slot.startTime === "09:00"), "Booked slot should disappear");
    results.push(["GET /api/bookings/slots after booking", "pass"]);

    const cancelBooking = await request("PATCH", `/bookings/${tempBookingId}/cancel`);
    assert(cancelBooking.status === 200, "PATCH /bookings/:id/cancel should return 200");
    assert(cancelBooking.data.status === "cancelled", "Cancelled booking should be marked cancelled");
    results.push(["PATCH /api/bookings/:id/cancel", "pass"]);

    const cancelBookingAgain = await request("PATCH", `/bookings/${tempBookingId}/cancel`);
    assert(cancelBookingAgain.status === 200, "Cancelling an already-cancelled booking should remain idempotent");
    results.push(["PATCH /api/bookings/:id/cancel idempotent", "pass"]);

    const cancelWithReason = await request("PATCH", `/bookings/${tempBookingId}/cancel`, {
      cancellationReason: "Checklist cancellation reason",
    });
    assert(cancelWithReason.status === 200, "Cancelling with a reason should return 200");
    assert(cancelWithReason.data.cancellationReason === "Checklist cancellation reason", "Cancellation reason should be persisted");
    results.push(["PATCH /api/bookings/:id/cancel with reason", "pass"]);

    const slotsAfterCancellation = await request("GET", `/bookings/slots?slug=${updatedSlug}&date=2026-03-30`);
    assert(slotsAfterCancellation.data.slots.some((slot) => slot.startTime === "09:00"), "Cancelled slot should be reusable");
    results.push(["GET /api/bookings/slots after cancellation", "pass"]);

    const rebookCancelledSlot = await request("POST", "/bookings", {
      slug: updatedSlug,
      date: "2026-03-30",
      startTime: "09:00",
      name: "Rebooked",
      email: "rebooked@example.com",
    });
    assert(rebookCancelledSlot.status === 201, "Cancelled slot should be rebookable");
    const rebookedId = rebookCancelledSlot.data.id;
    await request("PATCH", `/bookings/${rebookedId}/cancel`);
    results.push(["POST /api/bookings after cancellation", "pass"]);

    const pastBooking = await request("POST", "/bookings", {
      slug: updatedSlug,
      date: "2026-03-23",
      startTime: "09:45",
      name: "Past Booking",
      email: "past@example.com",
    });
    assert(pastBooking.status === 201, "Past booking setup should succeed");
    pastBookingId = pastBooking.data.id;

    const pastBookings = await request("GET", "/bookings?status=past");
    assert(pastBookings.status === 200, "GET /bookings?status=past should return 200");
    assert(pastBookings.data.some((booking) => booking.id === pastBookingId), "Past filter should include a past booking");
    results.push(["GET /api/bookings?status=past", "pass"]);

    const missingCancel = await request("PATCH", "/bookings/999999/cancel");
    assert(missingCancel.status === 404, "Cancelling unknown booking should return 404");
    results.push(["PATCH /api/bookings/:id/cancel missing", "pass"]);

    const badRoute = await request("GET", "/nope");
    assert(badRoute.status === 404, "Unknown route should return 404");
    results.push(["GET /api/nope", "pass"]);

    const badJson = await fetch(`${baseUrl}/event-types`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: "{",
    });
    assert(badJson.status === 400, "Malformed JSON should return 400");
    results.push(["POST /api/event-types malformed JSON", "pass"]);

    const createCascadeEventType = await request("POST", "/event-types", {
      title: "Cascade Test",
      description: "Cascade behavior",
      duration: 30,
      slug: `${tempSlug}-cascade`,
    });
    assert(createCascadeEventType.status === 201, "Cascade event type creation should succeed");
    tempCascadeEventTypeId = createCascadeEventType.data.id;

    const cascadeAvailability = await request("PUT", "/availability", {
      eventTypeId: tempCascadeEventTypeId,
      timezone: "Asia/Kolkata",
      rules: [{ dayOfWeek: 1, startTime: "09:00", endTime: "10:00" }],
    });
    assert(cascadeAvailability.status === 200, "Cascade availability setup should succeed");

    const cascadeBooking = await request("POST", "/bookings", {
      eventTypeId: tempCascadeEventTypeId,
      date: "2026-03-30",
      startTime: "09:00",
      name: "Cascade Booker",
      email: "cascade@example.com",
    });
    assert(cascadeBooking.status === 201, "Cascade booking setup should succeed");
    cascadeBookingId = cascadeBooking.data.id;

    const deleteCascadeEventType = await request("DELETE", `/event-types/${tempCascadeEventTypeId}`);
    assert(deleteCascadeEventType.status === 204, "Deleting event type should succeed");

    const cascadeScheduleCount = await prisma.availabilitySchedule.count({
      where: {
        eventTypeId: tempCascadeEventTypeId,
      },
    });
    const cascadeRuleCount = await prisma.availabilityRule.count({
      where: {
        schedule: {
          is: {
            eventTypeId: tempCascadeEventTypeId,
          },
        },
      },
    });
    const cascadeBookingCount = await prisma.booking.count({
      where: {
        eventTypeId: tempCascadeEventTypeId,
      },
    });
    const cascadeOverrideCount = await prisma.dateOverride.count({
      where: {
        schedule: {
          is: {
            eventTypeId: tempCascadeEventTypeId,
          },
        },
      },
    });
    assert(
      cascadeScheduleCount === 0 &&
      cascadeRuleCount === 0 &&
      cascadeOverrideCount === 0 &&
      cascadeBookingCount === 0,
      "Cascade delete should remove dependent availability schedules, rules, overrides, and bookings"
    );
    tempCascadeEventTypeId = null;
    cascadeBookingId = null;
    results.push(["DELETE /api/event-types cascade cleanup", "pass"]);

    const dstEventType = await request("POST", "/event-types", {
      title: "DST Event",
      description: "DST coverage",
      duration: 30,
      slug: dstSlug,
    });
    assert(dstEventType.status === 201, "DST event type creation should succeed");
    dstEventTypeId = dstEventType.data.id;

    const dstAvailability = await request("PUT", "/availability", {
      eventTypeId: dstEventTypeId,
      timezone: "America/New_York",
      rules: [{ dayOfWeek: 0, startTime: "01:00", endTime: "04:00" }],
    });
    assert(dstAvailability.status === 200, "DST availability setup should succeed");

    const dstSpringSlots = await request("GET", `/bookings/slots?slug=${dstSlug}&date=2026-03-08`);
    assert(dstSpringSlots.status === 200, "DST spring-forward slot query should return 200");
    const springTimes = dstSpringSlots.data.slots.map((slot) => slot.startTime);
    assert(!springTimes.includes("02:00") && !springTimes.includes("02:30"), "Nonexistent DST spring-forward times should not appear");
    results.push(["GET /api/bookings/slots DST spring-forward", "pass"]);

    const dstFallSlots = await request("GET", `/bookings/slots?slug=${dstSlug}&date=2026-11-01`);
    assert(dstFallSlots.status === 200, "DST fall-back slot query should return 200");
    assert(dstFallSlots.data.slots.length > 0, "DST fall-back query should still produce slots");
    results.push(["GET /api/bookings/slots DST fall-back", "pass"]);

    const concurrencyEventType = await request("POST", "/event-types", {
      title: "Concurrency Event",
      description: "Race check",
      duration: 30,
      slug: `${tempSlug}-concurrency`,
    });
    assert(concurrencyEventType.status === 201, "Concurrency event type creation should succeed");
    const concurrencyEventTypeId = concurrencyEventType.data.id;

    const concurrencyAvailability = await request("PUT", "/availability", {
      eventTypeId: concurrencyEventTypeId,
      timezone: "Asia/Kolkata",
      rules: [{ dayOfWeek: 1, startTime: "09:00", endTime: "10:00" }],
    });
    assert(concurrencyAvailability.status === 200, "Concurrency availability setup should succeed");

    const [raceOne, raceTwo] = await Promise.all([
      request("POST", "/bookings", {
        eventTypeId: concurrencyEventTypeId,
        date: "2026-03-30",
        startTime: "09:00",
        name: "Race One",
        email: "race-one@example.com",
      }),
      request("POST", "/bookings", {
        eventTypeId: concurrencyEventTypeId,
        date: "2026-03-30",
        startTime: "09:00",
        name: "Race Two",
        email: "race-two@example.com",
      }),
    ]);
    const raceStatuses = [raceOne.status, raceTwo.status].sort((left, right) => left - right);
    assert(raceStatuses[0] === 201 && raceStatuses[1] === 409, "Concurrent booking race should yield one success and one conflict");
    await request("DELETE", `/event-types/${concurrencyEventTypeId}`);
    results.push(["POST /api/bookings concurrency race", "pass"]);

    await request("PATCH", `/bookings/${tempBookingId}/cancel`);
    await request("PATCH", `/bookings/${pastBookingId}/cancel`);
    await request("DELETE", `/event-types/${tempEventTypeId}`);
    await request("DELETE", `/event-types/${dstEventTypeId}`);
    tempBookingId = null;
    pastBookingId = null;
    tempEventTypeId = null;
    dstEventTypeId = null;

    console.log(JSON.stringify({ success: true, results }, null, 2));
  } catch (error) {
    if (tempBookingId) {
      await request("PATCH", `/bookings/${tempBookingId}/cancel`);
    }

    if (pastBookingId) {
      await request("PATCH", `/bookings/${pastBookingId}/cancel`);
    }

    if (cascadeBookingId) {
      await request("PATCH", `/bookings/${cascadeBookingId}/cancel`);
    }

    if (tempCascadeEventTypeId) {
      await request("DELETE", `/event-types/${tempCascadeEventTypeId}`);
    }

    if (dstEventTypeId) {
      await request("DELETE", `/event-types/${dstEventTypeId}`);
    }

    if (tempEventTypeId) {
      await request("DELETE", `/event-types/${tempEventTypeId}`);
    }

    await cleanupTempData(tempSlugPrefix);

    console.error(
      JSON.stringify(
        {
          success: false,
          failedAt: results.at(-1)?.[0] ?? null,
          error: error.message,
          results,
        },
        null,
        2
      )
    );
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
