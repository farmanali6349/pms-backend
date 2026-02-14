import { drizzle } from "drizzle-orm/node-postgres";
import { dbUrl } from "../config/config";

if (!dbUrl) {
  throw new Error("Database URL Mising");
}

console.log("Connecting To DB");
export const db = drizzle(dbUrl);
