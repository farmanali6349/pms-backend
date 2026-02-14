import { drizzle } from "drizzle-orm/node-postgres";
import { dbUrl } from "../config/config.js";

if (!dbUrl) {
  throw new Error("Database URL Missing");
}

export const db = drizzle(dbUrl);
console.log("Database client initialized");
