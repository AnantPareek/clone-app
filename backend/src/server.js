import app from "./app.js";
import prisma from "./lib/prisma.js";

// ✅ MUST use Render's PORT
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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