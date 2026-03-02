import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SALT = "constancia-admin-v1";
const COOKIE_NAME = "admin_tok";

async function hashToken(password: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password + SALT)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function proxy(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  const expected = await hashToken(process.env.ADMIN_PASSWORD ?? "");
  if (cookie !== expected) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/empleados", "/admin/config"],
};
