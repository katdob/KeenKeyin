import type { Request, Response } from "express";
import { pool } from "../db.js";

interface UpdateUserBody {
  first_name?: string;
  last_name?: string;
  email?: string;
  date_of_birth?: string;
  active?: boolean;
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { first_name, last_name, email, date_of_birth, active } =
    req.body as UpdateUserBody;

  if (!id) {
    res.status(400).json({ error: "User id is required." });
    return;
  }

  if (
    first_name === undefined ||
    last_name === undefined ||
    email === undefined ||
    date_of_birth === undefined ||
    active === undefined
  ) {
    res.status(400).json({ error: "All profile fields are required." });
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
      `UPDATE "User"
       SET first_name = $1,
           last_name = $2,
           email = $3,
           date_of_birth = $4,
           active = $5
       WHERE id = $6
       RETURNING id, first_name, last_name, email, date_of_birth, active`,
      [first_name, last_name, email, date_of_birth, active, id],
    );

    const user = result.rows[0];

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.status(200).json({
      message: "Profile updated successfully.",
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
    console.error("Update user failed:", error);
    res.status(500).json({ error: "Unable to update user profile." });
  }
}
