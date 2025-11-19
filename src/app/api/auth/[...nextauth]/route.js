import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
  ssl: { rejectUnauthorized: false },
});

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        userid: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        console.log("signing in");
        console.log("username", credentials?.userid);

        if (!credentials?.userid || !credentials?.password) {
          console.log("no username or password");
          return null;
        }

        let client;
        try {
          client = await pool.connect();
          const queryText = `
        SELECT "userid", password
        FROM users 
        WHERE LOWER(userid) = LOWER($1)
      `;
          const result = await client.query(queryText, [credentials.userid]);
          const user = result.rows[0];
          if (!user) {
            console.log("account don't exist", credentials.userid);
            return null;
          }
          console.log("account exists ", user.userid);

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          console.log("is the password right? ", isValid);

          if (!isValid) {
            console.log("wrong password!!!!", user.userid);
            return null;
          }

          console.log("successful login");
          return {
            id: user.userid,
          };
        } catch (error) {
          console.error("what happened??", error);
          return null;
        } finally {
          if (client) {
            client.release();
            console.log("disconnect from db");
          }
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
