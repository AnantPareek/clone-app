import express from "express";
import cors from "cors";

import env from "./config/env.js";
import apiRoutes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      const isAllowed = env.frontendOrigins.some((allowedOrigin) => {
        return (
          allowedOrigin === origin ||
          allowedOrigin.replace(/\/$/, "") === origin.replace(/\/$/, "")
        );
      });

      if (isAllowed || env.nodeEnv === "development") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
