import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
import { defineConfig } from "drizzle-kit";

loadEnv({ path: resolve(__dirname, "../../.env") });
loadEnv({ path: resolve(process.cwd(), ".env") });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
