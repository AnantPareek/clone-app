import { Prisma } from "@prisma/client";

import { AppError } from "../utils/appError.js";

function mapPrismaError(error) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return null;
  }

  if (error.code === "P2002") {
    return new AppError(409, "A unique constraint was violated", {
      target: error.meta?.target,
    });
  }

  if (error.code === "P2025") {
    return new AppError(404, "The requested record was not found");
  }

  return null;
}

export function notFoundHandler(req, res, next) {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error, req, res, next) {
  void req;
  void next;

  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      error: "Invalid JSON payload",
    });
  }

  const prismaError = mapPrismaError(error);
  if (prismaError) {
    return res.status(prismaError.statusCode).json({
      error: prismaError.message,
      details: prismaError.details,
    });
  }

  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message = error instanceof AppError ? error.message : "Internal server error";

  if (statusCode >= 500) {
    console.error(error);
  }

  return res.status(statusCode).json({
    error: message,
    details: error instanceof AppError ? error.details : undefined,
  });
}
