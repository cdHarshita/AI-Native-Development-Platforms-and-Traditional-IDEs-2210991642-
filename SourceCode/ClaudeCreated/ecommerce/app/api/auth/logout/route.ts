import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST(): Promise<NextResponse> {
  const res = NextResponse.json({ data: { success: true } });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
