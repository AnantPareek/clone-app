import {
  cancelBooking,
  createBooking,
  listBookings,
} from "../services/bookingService.js";
import { getAvailableSlots } from "../services/slotService.js";
import {
  validateBookingListQuery,
  validateBookingPayload,
  validateCancellationPayload,
  validateIdParam,
  validateSlotQuery,
} from "../utils/validators.js";

export async function getBookingSlots(req, res) {
  const query = validateSlotQuery(req.query);
  const slots = await getAvailableSlots(query);

  res.json(slots);
}

export async function getLegacySlots(req, res) {
  const query = validateSlotQuery(req.query);
  const result = await getAvailableSlots(query);

  res.json(result.slots.map((slot) => slot.startTime));
}

export async function getBookings(req, res) {
  const query = validateBookingListQuery(req.query);
  const bookings = await listBookings(query);

  res.json(bookings);
}

export async function createBookingHandler(req, res) {
  const payload = validateBookingPayload(req.body);
  const booking = await createBooking(payload);

  res.status(201).json(booking);
}

export async function cancelBookingHandler(req, res) {
  const id = validateIdParam(req.params.id);
  const payload = validateCancellationPayload(req.body);
  const booking = await cancelBooking(id, payload);

  res.json(booking);
}
