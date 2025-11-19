import { NextResponse } from "next/server";
import { POST as NextAuthPOST } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  const body = await request.json();
  const formData = new FormData();
  formData.append("username", body.username);
  formData.append("password", body.password);
  formData.append("json", "true");

  const modifiedRequest = new Request(request.url, {
    method: "POST",
    headers: request.headers,
    body: formData,
    url: request.url.replace("/signin", "/api/auth/callback/credentials"),
  });

  try {
    const response = await NextAuthPOST(modifiedRequest);

    if (response.status === 200) {
      return response;
    } else {
      const data = await response.json();
      return NextResponse.json(
        { message: data.error || "Authentication failed." },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Sign-in route error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
