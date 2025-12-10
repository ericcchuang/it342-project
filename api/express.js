import express from "express";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

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

const JWT_SECRET =
  process.env.NEXTAUTH_SECRET || "fallback-secret-for-development";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.post("/api/signup", async (req, res) => {
  const { userid, password } = req.body;

  if (!userid || !password) {
    return res
      .status(400)
      .json({ message: "Missing required fields (userid and password)." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const queryText = `
            INSERT INTO users (userID, password)
            VALUES ($1, $2)
            RETURNING "userid";
        `;
    const result = await pool.query(queryText, [userid, hashedPassword]);

    const newUser = result.rows[0];
    console.log(`New user created: ${newUser.userid}`);
    return res.status(201).json({
      message: "Account created successfully.",
      user: { userid: newUser.userid },
    });
  } catch (error) {
    console.error("Account creation error:", error);
    // PostgreSQL duplicate key error code
    if (error.code === "23505") {
      return res.status(409).json({ message: "Username already exists." });
    }
    return res.status(500).json({
      message: "An internal server error occurred during account creation.",
    });
  }
});

app.post("/api/auth/signin", async (req, res) => {
  const { userid, password } = req.body;

  if (!userid || !password) {
    return res
      .status(401)
      .json({ message: "Authentication failed. Missing credentials." });
  }

  let client;
  try {
    client = await pool.connect();
    const queryText = `
            SELECT "userid", password
            FROM users 
            WHERE LOWER(userid) = LOWER($1)
        `;
    const result = await client.query(queryText, [userid]);
    const user = result.rows[0];

    if (!user) {
      console.log(`Login attempt for non-existent user: ${userid}`);
      return res.status(401).json({
        message: "Authentication failed. Invalid username or password.",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      console.log(`Wrong password for user: ${user.userid}`);
      return res.status(401).json({
        message: "Authentication failed. Invalid username or password.",
      });
    }

    const token = jwt.sign({ id: user.userid, iat: Date.now() }, JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("Successful login and token generated.");

    return res.status(200).json({
      message: "Authentication successful.",
      token: token,
      user: { id: user.userid },
    });
  } catch (error) {
    console.error("Internal sign-in error:", error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred." });
  } finally {
    if (client) {
      client.release();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Express API Service listening on port ${PORT}`);
  console.log(`DB Host: ${process.env.PG_HOST}`);
});
