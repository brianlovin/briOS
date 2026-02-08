import { defineConfig } from "drizzle-kit";

// Use direct connection (port 5432) for DDL operations like migrations,
// even if DATABASE_URL points to PgBouncer (port 6432)
const url = process.env.DATABASE_URL!.replace(":6432", ":5432");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/*",
  dbCredentials: { url },
});
