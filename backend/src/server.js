import app from "./app.js";
import prisma from "./lib/prisma.js";

import env from "./config/env.js";

// ✅ Use central port configuration
const PORT = env.port;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

// ✅ Keep event loop alive if app.listen returns for any reason (safety check)
setInterval(() => {}, 1 << 30);

// Graceful shutdown
async function shutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully.`);

  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log("Prisma disconnected");
    } catch (err) {
      console.error("Error during shutdown:", err);
    } finally {
      process.exit(0);
    }
  });
}

// Handle termination signals (important for Render)
process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});