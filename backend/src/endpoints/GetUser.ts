import type { Request, Response } from "express";
import { pool } from "../db.js";

export async function getUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "User id is required." });
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
    }>(
      `SELECT id, first_name, last_name, email, date_of_birth, active
       FROM "User"
       WHERE id = $1`,
      [id],
    );

    const user = result.rows[0];

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.status(200).json({
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
    console.error("Get user failed:", error);
    res.status(500).json({ error: "Unable to load user profile." });
  }
}
