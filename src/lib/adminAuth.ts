const SALT = "constancia-admin-v1";

export async function hashToken(password: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password + SALT)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyAdminCookie(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await hashToken(process.env.ADMIN_PASSWORD ?? "");
  return cookieValue === expected;
}

export const COOKIE_NAME = "admin_tok";
export const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours
