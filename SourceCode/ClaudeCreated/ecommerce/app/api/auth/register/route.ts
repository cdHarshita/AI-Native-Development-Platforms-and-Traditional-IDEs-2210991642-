import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { signToken } from "@/lib/jwt";
import { COOKIE_NAME } from "@/lib/auth";
import { Role, ApiResponse, User } from "@/types";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<User>>> {
  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (!["buyer", "seller"].includes(role)) {
      return NextResponse.json({ error: "Role must be buyer or seller." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json({ error: "Email already in use." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    const user: User = {
      id: uuidv4(),
      email: email.toLowerCase().trim(),
      name: name.trim(),
      role: role as Role,
      created_at: now,
    };

    const { error: insertError } = await supabaseAdmin
      .from("users")
      .insert({ ...user, password_hash: hashed });

    if (insertError) {
      return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
    }

    const token = await signToken({ sub: user.id, email: user.email, name: user.name, role: user.role });

    const res = NextResponse.json({ data: user }, { status: 201 });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
