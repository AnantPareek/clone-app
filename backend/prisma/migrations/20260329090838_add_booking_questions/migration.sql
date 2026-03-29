-- AlterTable
ALTER TABLE "AvailabilityRule" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "AvailabilitySchedule" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "responses" JSONB DEFAULT '{}',
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "DateOverride" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "EventType" ADD COLUMN     "bookingQuestions" JSONB DEFAULT '[]',
ALTER COLUMN "updatedAt" DROP DEFAULT;
