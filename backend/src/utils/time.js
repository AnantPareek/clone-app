const formatterCache = new Map();

export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function getFormatter(timeZone) {
  if (!formatterCache.has(timeZone)) {
    formatterCache.set(
      timeZone,
      new Intl.DateTimeFormat("en-CA", {
        timeZone,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  }

  return formatterCache.get(timeZone);
}

function getDateTimeParts(date, timeZone) {
  const parts = getFormatter(timeZone).formatToParts(date);
  const result = {};

  for (const part of parts) {
    if (part.type !== "literal") {
      result[part.type] = part.value;
    }
  }

  return result;
}

function getTimeZoneOffsetMs(timeZone, date) {
  const parts = getDateTimeParts(date, timeZone);
  const utcTimestamp = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );

  return utcTimestamp - date.getTime();
}

export function isValidTimeZone(timeZone) {
  try {
    getFormatter(timeZone);
    return true;
  } catch {
    return false;
  }
}

export function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function addMinutes(timeString, minutesToAdd) {
  return minutesToTime(timeToMinutes(timeString) + minutesToAdd);
}

export function addDays(dateString, daysToAdd) {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + daysToAdd);

  return date.toISOString().slice(0, 10);
}

export function getDayOfWeek(dateString) {
  return new Date(`${dateString}T00:00:00.000Z`).getUTCDay();
}

export function dateStringToStoredDate(dateString) {
  return new Date(`${dateString}T00:00:00.000Z`);
}

export function storedDateToDateString(date) {
  return date.toISOString().slice(0, 10);
}

export function localDateTimeToUtc(dateString, timeString, timeZone) {
  const [year, month, day] = dateString.split("-").map(Number);
  const [hour, minute] = timeString.split(":").map(Number);

  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const initialOffset = getTimeZoneOffsetMs(timeZone, utcGuess);

  let utcDate = new Date(utcGuess.getTime() - initialOffset);

  const correctedOffset = getTimeZoneOffsetMs(timeZone, utcDate);
  if (correctedOffset !== initialOffset) {
    utcDate = new Date(utcGuess.getTime() - correctedOffset);
  }

  const parts = getDateTimeParts(utcDate, timeZone);
  const formattedDate = `${parts.year}-${parts.month}-${parts.day}`;
  const formattedTime = `${parts.hour}:${parts.minute}`;

  if (formattedDate !== dateString || formattedTime !== timeString) {
    return null;
  }

  return utcDate;
}

export function formatUtcInTimeZone(date, timeZone) {
  const parts = getDateTimeParts(date, timeZone);

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  };
}

export function getUtcRangeForLocalDate(dateString, timeZone) {
  const startAt = localDateTimeToUtc(dateString, "00:00", timeZone);
  const endAt = localDateTimeToUtc(addDays(dateString, 1), "00:00", timeZone);

  if (!startAt || !endAt) {
    throw new Error(`Could not compute UTC date range for ${dateString} in ${timeZone}`);
  }

  return {
    startAt,
    endAt,
  };
}
