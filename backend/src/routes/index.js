import { Router } from "express";

import availabilityRoutes from "./availabilityRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import eventTypeRoutes from "./eventTypeRoutes.js";
import healthRoutes from "./healthRoutes.js";
import { getLegacySlots } from "../controllers/bookingController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/event-types", eventTypeRoutes);
router.use("/availability", availabilityRoutes);
router.use("/bookings", bookingRoutes);
router.get("/slots", asyncHandler(getLegacySlots));

export default router;
