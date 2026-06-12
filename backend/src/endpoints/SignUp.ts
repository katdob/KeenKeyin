import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { pool } from "../db.js";

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
}

export async function signUp(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body as SignUpBody;
  const userEmail = email ?? username;

  if (!userEmail || !password) {
    res.status(400).json({ error: "Username and password are required." });
    return;
  }

  try {
    const existingUser = await pool.query<{ id: string }>(
      `SELECT id FROM "User" WHERE email = $1`,
      [userEmail],
    );

    if (existingUser.rows[0]) {
      res.status(200).json({ error: "A user with this email already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const userResult = await client.query<{
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        date_of_birth: Date;
        active: boolean;
      }>(
        `INSERT INTO "User" (first_name, last_name, email, date_of_birth)
         VALUES ('', '', $1, $2)
         RETURNING id, first_name, last_name, email, date_of_birth, active`,
        [userEmail, "1970-01-01 00:00:00"],
      );

      const newUser = userResult.rows[0];

      await client.query(
        `INSERT INTO "Password" (hashed_password, user_id)
         VALUES ($1, $2)`,
        [hashedPassword, newUser.id],
      );

      await client.query("COMMIT");

      res.status(201).json({
        message: "User created successfully.",
        user: {
          id: newUser.id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
          date_of_birth: newUser.date_of_birth,
          active: newUser.active,
        },
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Sign up failed:", error);
    res.status(500).json({ error: "Unable to sign up right now." });
  }
}
