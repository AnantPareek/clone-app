import { Router } from "express";

import {
  createAvailabilityHandler,
  getAvailability,
  replaceAvailabilityHandler,
} from "../controllers/availabilityController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getAvailability));
router.post("/", asyncHandler(createAvailabilityHandler));
router.put("/", asyncHandler(replaceAvailabilityHandler));

export default router;
