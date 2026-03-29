import {
  createEventType,
  deleteEventType,
  getEventTypeBySlug,
  listEventTypes,
  updateEventType,
} from "../services/eventTypeService.js";
import {
  validateEventTypePayload,
  validateIdParam,
} from "../utils/validators.js";

export async function getEventTypes(req, res) {
  void req;

  const eventTypes = await listEventTypes();
  res.json(eventTypes);
}

export async function getEventType(req, res) {
  const eventType = await getEventTypeBySlug(req.params.slug);
  res.json(eventType);
}

export async function createEventTypeHandler(req, res) {
  const payload = validateEventTypePayload(req.body);
  const eventType = await createEventType(payload);

  res.status(201).json(eventType);
}

export async function updateEventTypeHandler(req, res) {
  const id = validateIdParam(req.params.id);
  const payload = validateEventTypePayload(req.body, { partial: true });
  const eventType = await updateEventType(id, payload);

  res.json(eventType);
}

export async function deleteEventTypeHandler(req, res) {
  const id = validateIdParam(req.params.id);
  await deleteEventType(id);

  res.status(204).send();
}
