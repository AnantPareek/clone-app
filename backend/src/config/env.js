import "dotenv/config";

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

const port = Number(process.env.PORT ?? 5001);

if (Number.isNaN(port) || port <= 0) {
  throw new Error("PORT must be a valid positive number");
}

const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port,
  databaseUrl: getRequiredEnv("DATABASE_URL"),
  frontendUrl: process.env.FRONTEND_URL ?? "",
};

export default env;
