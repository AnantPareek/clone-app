import { AppError } from "./appError.js";
import {
  DATE_PATTERN,
  TIME_PATTERN,
  isValidTimeZone,
  timeToMinutes,
} from "./time.js";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ensureObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new AppError(400, `${label} must be an object`);
  }

  return value;
}

function parseInteger(value, fieldName, { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = {}) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    throw new AppError(400, `${fieldName} must be an integer`);
  }

  if (parsed < min || parsed > max) {
    throw new AppError(400, `${fieldName} must be between ${min} and ${max}`);
  }

  return parsed;
}

function parseRequiredString(value, fieldName, { maxLength, pattern } = {}) {
  if (typeof value !== "string" || !value.trim()) {
    throw new AppError(400, `${fieldName} is required`);
  }

  const trimmed = value.trim();

  if (maxLength && trimmed.length > maxLength) {
    throw new AppError(400, `${fieldName} must be at most ${maxLength} characters`);
  }

  if (pattern && !pattern.test(trimmed)) {
    throw new AppError(400, `${fieldName} is invalid`);
  }

  return trimmed;
}

function parseOptionalString(value, fieldName, { maxLength } = {}) {
  if (value == null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new AppError(400, `${fieldName} must be a string`);
  }

  const trimmed = value.trim();

  if (maxLength && trimmed.length > maxLength) {
    throw new AppError(400, `${fieldName} must be at most ${maxLength} characters`);
  }

  return trimmed || null;
}

function parseOptionalBoolean(value, fieldName) {
  if (value == null) {
    return null;
  }

  if (typeof value !== "boolean") {
    throw new AppError(400, `${fieldName} must be a boolean`);
  }

  return value;
}

function parseOptionalJson(value, fieldName) {
  if (value == null) {
    return null;
  }

  if (typeof value !== "object") {
    throw new AppError(400, `${fieldName} must be a valid JSON object or array`);
  }

  return value;
}

function parseDateString(value, fieldName) {
  const dateString = parseRequiredString(value, fieldName);

  if (!DATE_PATTERN.test(dateString) || Number.isNaN(Date.parse(`${dateString}T00:00:00.000Z`))) {
    throw new AppError(400, `${fieldName} must be a valid date in YYYY-MM-DD format`);
  }

  return dateString;
}

function parseTimeString(value, fieldName) {
  const timeString = parseRequiredString(value, fieldName);

  if (!TIME_PATTERN.test(timeString)) {
    throw new AppError(400, `${fieldName} must be in HH:MM format`);
  }

  return timeString;
}

function parseTimeZone(value, fieldName) {
  const timeZone = parseRequiredString(value, fieldName);

  if (!isValidTimeZone(timeZone)) {
    throw new AppError(400, `${fieldName} must be a valid IANA timezone`);
  }

  return timeZone;
}

function ensureStartBeforeEnd(startTime, endTime) {
  if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
    throw new AppError(400, "startTime must be earlier than endTime");
  }
}

export function validateIdParam(value, fieldName = "id") {
  return parseInteger(value, fieldName, { min: 1 });
}

export function validateEventTypePayload(body, { partial = false } = {}) {
  const input = ensureObject(body, "Request body");

  const payload = {};

  if (!partial || input.title !== undefined) {
    payload.title = parseRequiredString(input.title, "title", { maxLength: 120 });
  }

  if (!partial || input.slug !== undefined) {
    payload.slug = parseRequiredString(input.slug, "slug", {
      maxLength: 120,
      pattern: SLUG_PATTERN,
    });
  }

  if (!partial || input.duration !== undefined) {
    payload.duration = parseInteger(input.duration, "duration", { min: 1, max: 1440 });
  }

  if (!partial || input.description !== undefined) {
    payload.description = parseOptionalString(input.description, "description", {
      maxLength: 2000,
    });
  }

  if (!partial || input.bookingQuestions !== undefined) {
    payload.bookingQuestions = parseOptionalJson(input.bookingQuestions, "bookingQuestions");
  }

  if (partial && Object.keys(payload).length === 0) {
    throw new AppError(400, "At least one field is required to update an event type");
  }

  return payload;
}

export function validateAvailabilityCreatePayload(body) {
  const input = ensureObject(body, "Request body");
  const eventTypeId = parseInteger(input.eventTypeId, "eventTypeId", { min: 1 });
  const dayOfWeek = parseInteger(input.dayOfWeek, "dayOfWeek", { min: 0, max: 6 });
  const startTime = parseTimeString(input.startTime, "startTime");
  const endTime = parseTimeString(input.endTime, "endTime");
  const timezone = parseTimeZone(input.timezone, "timezone");

  ensureStartBeforeEnd(startTime, endTime);

  return {
    eventTypeId,
    dayOfWeek,
    startTime,
    endTime,
    timezone,
  };
}

export function validateAvailabilityReplacePayload(body) {
  const input = ensureObject(body, "Request body");
  const eventTypeId = parseInteger(input.eventTypeId, "eventTypeId", { min: 1 });
  const timezone = parseTimeZone(input.timezone, "timezone");
  const scheduleName = parseOptionalString(input.scheduleName, "scheduleName", {
    maxLength: 120,
  }) ?? "Default Schedule";

  if (!Array.isArray(input.rules) || input.rules.length === 0) {
    throw new AppError(400, "rules must be a non-empty array");
  }

  const rules = input.rules.map((rule, index) => {
    const item = ensureObject(rule, `rules[${index}]`);
    const dayOfWeek = parseInteger(item.dayOfWeek, `rules[${index}].dayOfWeek`, {
      min: 0,
      max: 6,
    });
    const startTime = parseTimeString(item.startTime, `rules[${index}].startTime`);
    const endTime = parseTimeString(item.endTime, `rules[${index}].endTime`);

    ensureStartBeforeEnd(startTime, endTime);

    return {
      dayOfWeek,
      startTime,
      endTime,
      timezone,
    };
  });

  let dateOverrides = [];

  if (input.dateOverrides !== undefined) {
    if (!Array.isArray(input.dateOverrides)) {
      throw new AppError(400, "dateOverrides must be an array");
    }

    dateOverrides = input.dateOverrides.map((override, index) => {
      const item = ensureObject(override, `dateOverrides[${index}]`);
      const date = parseDateString(item.date, `dateOverrides[${index}].date`);
      const isUnavailable = parseOptionalBoolean(
        item.isUnavailable,
        `dateOverrides[${index}].isUnavailable`
      ) ?? false;

      if (isUnavailable) {
        if (item.startTime !== undefined || item.endTime !== undefined) {
          throw new AppError(
            400,
            `dateOverrides[${index}] cannot include startTime/endTime when isUnavailable is true`
          );
        }

        return {
          date,
          isUnavailable: true,
          startTime: null,
          endTime: null,
        };
      }

      const startTime = parseTimeString(
        item.startTime,
        `dateOverrides[${index}].startTime`
      );
      const endTime = parseTimeString(item.endTime, `dateOverrides[${index}].endTime`);

      ensureStartBeforeEnd(startTime, endTime);

      return {
        date,
        isUnavailable: false,
        startTime,
        endTime,
      };
    });
  }

  return {
    eventTypeId,
    timezone,
    scheduleName,
    rules,
    dateOverrides,
  };
}

export function validateAvailabilityQuery(query) {
  const hasEventTypeId = query.eventTypeId !== undefined;
  const hasSlug = query.slug !== undefined;

  if (!hasEventTypeId && !hasSlug) {
    throw new AppError(400, "Provide either eventTypeId or slug");
  }

  return {
    eventTypeId: hasEventTypeId ? parseInteger(query.eventTypeId, "eventTypeId", { min: 1 }) : null,
    slug: hasSlug ? parseRequiredString(query.slug, "slug", { pattern: SLUG_PATTERN }) : null,
  };
}

export function validateSlotQuery(query) {
  const eventSelector = validateAvailabilityQuery(query);
  const date = parseDateString(query.date, "date");

  return {
    ...eventSelector,
    date,
  };
}

export function validateBookingPayload(body) {
  const input = ensureObject(body, "Request body");
  const eventTypeId = input.eventTypeId !== undefined
    ? parseInteger(input.eventTypeId, "eventTypeId", { min: 1 })
    : null;
  const slug = input.slug !== undefined
    ? parseRequiredString(input.slug, "slug", { pattern: SLUG_PATTERN })
    : null;

  if (!eventTypeId && !slug) {
    throw new AppError(400, "Provide either eventTypeId or slug");
  }

  const date = parseDateString(input.date, "date");
  const startTime = parseTimeString(input.startTime, "startTime");
  const name = parseRequiredString(input.name ?? input.bookerName, "name", {
    maxLength: 120,
  });
  const email = parseRequiredString(input.email ?? input.bookerEmail, "email", {
    maxLength: 255,
  }).toLowerCase();

  if (!EMAIL_PATTERN.test(email)) {
    throw new AppError(400, "email must be a valid email address");
  }

  const timezone = input.timezone == null ? null : parseTimeZone(input.timezone, "timezone");

  const responses = parseOptionalJson(input.responses, "responses") ?? {};

  return {
    eventTypeId,
    slug,
    date,
    startTime,
    name,
    email,
    timezone,
    responses,
  };
}

export function validateBookingListQuery(query) {
  const allowedStatuses = new Set(["all", "booked", "cancelled", "upcoming", "past"]);
  const rawStatus = typeof query.status === "string" ? query.status : "all";

  if (!allowedStatuses.has(rawStatus)) {
    throw new AppError(400, "status must be one of all, booked, cancelled, upcoming, or past");
  }

  return {
    status: rawStatus,
    eventTypeId: query.eventTypeId === undefined
      ? null
      : parseInteger(query.eventTypeId, "eventTypeId", { min: 1 }),
  };
}

export function validateCancellationPayload(body) {
  if (body == null || Object.keys(body).length === 0) {
    return {
      cancellationReason: null,
    };
  }

  const input = ensureObject(body, "Request body");

  return {
    cancellationReason: parseOptionalString(
      input.cancellationReason,
      "cancellationReason",
      { maxLength: 500 }
    ),
  };
}
