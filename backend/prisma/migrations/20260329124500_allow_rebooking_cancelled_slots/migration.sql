DROP INDEX IF EXISTS "Booking_eventTypeId_date_startTime_key";

CREATE UNIQUE INDEX "Booking_active_slot_unique"
ON "Booking"("eventTypeId", "date", "startTime")
WHERE "status" <> 'cancelled';
