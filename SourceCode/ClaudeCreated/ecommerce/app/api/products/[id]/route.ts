import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { ApiResponse, Product } from "@/types";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx): Promise<NextResponse<ApiResponse<Product>>> {
  const { id } = await ctx.params;
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*, users(name)")
    .eq("id", id)
    .single();
  if (error || !data) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json({ data: { ...data, seller_name: data.users?.name, users: undefined } });
}

export async function PATCH(req: NextRequest, ctx: Ctx): Promise<NextResponse<ApiResponse<Product>>> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "seller") return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const { id } = await ctx.params;
    const { data: existing } = await supabaseAdmin.from("products").select("seller_id").eq("id", id).single();
    if (!existing) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    if (existing.seller_id !== user.sub) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const body = await req.json();
    const patch: Partial<Product> = {};
    if (body.name) patch.name = body.name.trim();
    if (body.description) patch.description = body.description.trim();
    if (body.price != null) patch.price = parseFloat(body.price);
    if (body.stock != null) patch.stock = parseInt(body.stock);
    if (body.image_url !== undefined) patch.image_url = body.image_url?.trim() || null;
    if (body.category) patch.category = body.category.trim();
    patch.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin.from("products").update(patch).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx): Promise<NextResponse<ApiResponse<{ id: string }>>> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "seller") return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const { id } = await ctx.params;
    const { data: existing } = await supabaseAdmin.from("products").select("seller_id").eq("id", id).single();
    if (!existing) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    if (existing.seller_id !== user.sub) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: { id } });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
