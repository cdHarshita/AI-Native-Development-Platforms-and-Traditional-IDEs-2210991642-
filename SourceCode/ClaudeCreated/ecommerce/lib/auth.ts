import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { JWTPayload } from "@/types";

export const COOKIE_NAME = "auth_token";

export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(role?: "buyer" | "seller"): Promise<JWTPayload> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  if (role && user.role !== role) throw new Error("FORBIDDEN");
  return user;
}
