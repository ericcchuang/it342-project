import { NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
  ssl: { rejectUnauthorized: false },
});

export async function POST(request) {
  const { userid, password, vendorID, clientID } = await request.json();

  if (!userid || !password) {
    return NextResponse.json({ message: "missing fields" }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const queryText = `
      INSERT INTO users (userID, password)
      VALUES ($1, $2)
      RETURNING "userid", userid; 
    `;
    const result = await pool.query(queryText, [userid, hashedPassword]);

    const newUser = result.rows[0];
    return NextResponse.json(
      {
        message: "account created",
        user: { userid: newUser.userid },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Account creation error:", error);
    if (error.code === "23505") {
      return NextResponse.json(
        { message: "Username or email already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json({ message: "what happened" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "not allowed" }, { status: 405 });
}
