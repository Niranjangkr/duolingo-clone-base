import "dotenv/config";

import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL
  },
})

// import type { Config } from "drizzle-kit";

// export default {
//   schema: "./db/schema.ts",
//   out: "./drizzle",
//   driver: "pg",
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL,
//   },
// } satisfies Config;
