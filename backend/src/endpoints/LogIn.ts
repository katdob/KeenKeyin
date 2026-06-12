import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { pool } from "../db.js";

interface LogInBody {
  username?: string;
  password?: string;
}

export async function logIn(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body as LogInBody;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required." });
    return;
  }

  try {
    const result = await pool.query<{
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      date_of_birth: Date;
      active: boolean;
      hashed_password: string;
    }>(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.date_of_birth, u.active, p.hashed_password
       FROM "User" u
       INNER JOIN "Password" p ON p.user_id = u.id
       WHERE u.email = $1`,
      [username],
    );

    const user = result.rows[0];

    if (!user) {
      res.status(401).json({ error: "Invalid username or password." });
      return;
    }

    if (!user.active) {
      res.status(403).json({ error: "This account is inactive." });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.hashed_password);

    if (!passwordMatches) {
      res.status(200).json({ error: "Invalid username or password." });
      return;
    }

    res.status(200).json({
      message: "Logged in successfully.",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        date_of_birth: user.date_of_birth,
        active: user.active,
      },
    });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(200).json({ error: "Unable to log in right now." });
  }
}
