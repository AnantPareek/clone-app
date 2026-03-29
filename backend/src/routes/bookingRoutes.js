import { Router } from "express";

import {
  cancelBookingHandler,
  createBookingHandler,
  getBookings,
  getBookingSlots,
} from "../controllers/bookingController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/slots", asyncHandler(getBookingSlots));
router.get("/", asyncHandler(getBookings));
router.post("/", asyncHandler(createBookingHandler));
router.patch("/:id/cancel", asyncHandler(cancelBookingHandler));

export default router;
