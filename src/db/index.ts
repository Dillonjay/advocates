import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const setup = () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL is not set in env");
  }

  // for query purposes
  const queryClient = postgres(dbUrl);
  const db = drizzle(queryClient);
  return db;
};

export default setup();
