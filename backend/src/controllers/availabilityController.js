import {
  createAvailabilityRule,
  getAvailabilitySchedule,
  replaceAvailabilitySchedule,
} from "../services/availabilityService.js";
import {
  validateAvailabilityCreatePayload,
  validateAvailabilityQuery,
  validateAvailabilityReplacePayload,
} from "../utils/validators.js";

export async function getAvailability(req, res) {
  const selector = validateAvailabilityQuery(req.query);
  const availability = await getAvailabilitySchedule(selector);

  res.json(availability);
}

export async function createAvailabilityHandler(req, res) {
  const payload = validateAvailabilityCreatePayload(req.body);
  const availability = await createAvailabilityRule(payload);

  res.status(201).json(availability);
}

export async function replaceAvailabilityHandler(req, res) {
  const payload = validateAvailabilityReplacePayload(req.body);
  const availability = await replaceAvailabilitySchedule(payload);

  res.json(availability);
}
