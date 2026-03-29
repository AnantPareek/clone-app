ALTER TABLE "EventType"
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE "AvailabilitySchedule" (
    "id" SERIAL NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvailabilitySchedule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AvailabilityRule" (
    "id" SERIAL NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvailabilityRule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DateOverride" (
    "id" SERIAL NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "isUnavailable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DateOverride_pkey" PRIMARY KEY ("id")
);

INSERT INTO "AvailabilitySchedule" ("eventTypeId", "name", "timezone", "isDefault", "createdAt", "updatedAt")
SELECT
    "eventTypeId",
    'Default Schedule',
    MIN("timezone"),
    true,
    MIN("createdAt"),
    CURRENT_TIMESTAMP
FROM "Availability"
GROUP BY "eventTypeId";

INSERT INTO "AvailabilityRule" ("scheduleId", "dayOfWeek", "startTime", "endTime", "createdAt", "updatedAt")
SELECT
    s."id",
    a."dayOfWeek",
    a."startTime",
    a."endTime",
    a."createdAt",
    CURRENT_TIMESTAMP
FROM "Availability" a
JOIN "AvailabilitySchedule" s
  ON s."eventTypeId" = a."eventTypeId"
 AND s."isDefault" = true;

ALTER TABLE "Booking"
ADD COLUMN "startAt" TIMESTAMP(3),
ADD COLUMN "endAt" TIMESTAMP(3),
ADD COLUMN "timezone" TEXT,
ADD COLUMN "cancelledAt" TIMESTAMP(3),
ADD COLUMN "cancellationReason" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "Booking" AS b
SET
    "timezone" = COALESCE(s."timezone", 'UTC'),
    "startAt" = ((b."date"::date + b."startTime"::time) AT TIME ZONE COALESCE(s."timezone", 'UTC')),
    "endAt" = ((b."date"::date + b."endTime"::time) AT TIME ZONE COALESCE(s."timezone", 'UTC')),
    "cancelledAt" = CASE
        WHEN b."status" = 'cancelled' THEN COALESCE(b."createdAt", CURRENT_TIMESTAMP)
        ELSE NULL
    END,
    "updatedAt" = CURRENT_TIMESTAMP
FROM "EventType" e
LEFT JOIN "AvailabilitySchedule" s
  ON s."eventTypeId" = e."id"
 AND s."isDefault" = true
WHERE b."eventTypeId" = e."id";

ALTER TABLE "Booking"
ALTER COLUMN "startAt" SET NOT NULL,
ALTER COLUMN "endAt" SET NOT NULL,
ALTER COLUMN "timezone" SET NOT NULL;

DROP INDEX IF EXISTS "Booking_eventTypeId_date_startTime_key";
DROP INDEX IF EXISTS "Booking_active_slot_unique";

ALTER TABLE "Booking"
DROP COLUMN "date",
DROP COLUMN "startTime",
DROP COLUMN "endTime";

DROP TABLE "Availability";

CREATE INDEX "AvailabilitySchedule_eventTypeId_idx" ON "AvailabilitySchedule"("eventTypeId");
CREATE INDEX "AvailabilitySchedule_eventTypeId_isDefault_idx" ON "AvailabilitySchedule"("eventTypeId", "isDefault");
CREATE UNIQUE INDEX "AvailabilitySchedule_default_eventType_unique"
ON "AvailabilitySchedule"("eventTypeId")
WHERE "isDefault" = true;

CREATE INDEX "AvailabilityRule_scheduleId_dayOfWeek_idx" ON "AvailabilityRule"("scheduleId", "dayOfWeek");
CREATE INDEX "DateOverride_scheduleId_date_idx" ON "DateOverride"("scheduleId", "date");

CREATE INDEX "Booking_eventTypeId_startAt_idx" ON "Booking"("eventTypeId", "startAt");
CREATE INDEX "Booking_status_startAt_idx" ON "Booking"("status", "startAt");
CREATE UNIQUE INDEX "Booking_active_slot_unique"
ON "Booking"("eventTypeId", "startAt")
WHERE "status" <> 'cancelled';

ALTER TABLE "AvailabilitySchedule"
ADD CONSTRAINT "AvailabilitySchedule_eventTypeId_fkey"
FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AvailabilityRule"
ADD CONSTRAINT "AvailabilityRule_scheduleId_fkey"
FOREIGN KEY ("scheduleId") REFERENCES "AvailabilitySchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DateOverride"
ADD CONSTRAINT "DateOverride_scheduleId_fkey"
FOREIGN KEY ("scheduleId") REFERENCES "AvailabilitySchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
