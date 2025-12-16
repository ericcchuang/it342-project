import express from "express";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";

if (!process.env.PG_HOST) {
  dotenv.config({ path: ".env.local" });
}

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: parseInt(process.env.PG_PORT || "5432", 10),
  ssl: { rejectUnauthorized: false },
});

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.NEXTAUTH_URL || "http://localhost:3000"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.post("/api/signup", async (req, res) => {
  const { userid, password } = req.body;

  if (!userid || !password)
    return res.status(400).json({ message: "Missing fields." });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (userID, password) VALUES ($1, $2) RETURNING "userid"`,
      [userid, hashedPassword]
    );

    return res.status(201).json({
      message: "Account created successfully.",
      user: { userid: result.rows[0].userid },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    if (error.code === "23505")
      return res.status(409).json({ message: "Username exists." });
    return res.status(500).json({ message: "Server error." });
  }
});

app.post("/api/auth/signin", async (req, res) => {
  const { userid, password } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT "userid", password FROM users WHERE LOWER(userid) = LOWER($1)`,
      [userid]
    );
    client.release();

    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.userid }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Login successful",
      user: { id: user.userid },
    });
  } catch (error) {
    console.error("Signin Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
});

app.get("/api/auth/me", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ isAuthenticated: false, user: null });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({
      isAuthenticated: true,
      user: { id: decoded.id },
    });
  } catch (err) {
    return res.json({ isAuthenticated: false, user: null });
  }
});

app.post("/api/auth/signout", (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out successfully" });
});

app.listen(PORT, () => {
  console.log(`Express API running on port ${PORT}`);
});
