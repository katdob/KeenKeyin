import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://keenkeyin:keenkeyin@localhost:5432/keenkeyin",
});
