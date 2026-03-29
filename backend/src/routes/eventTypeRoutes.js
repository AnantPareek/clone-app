import { Router } from "express";

import {
  createEventTypeHandler,
  deleteEventTypeHandler,
  getEventType,
  getEventTypes,
  updateEventTypeHandler,
} from "../controllers/eventTypeController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getEventTypes));
router.get("/:slug", asyncHandler(getEventType));
router.post("/", asyncHandler(createEventTypeHandler));
router.put("/:id", asyncHandler(updateEventTypeHandler));
router.delete("/:id", asyncHandler(deleteEventTypeHandler));

export default router;
