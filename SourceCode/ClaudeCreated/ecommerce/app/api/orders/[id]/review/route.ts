import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { ApiResponse, Review } from "@/types";
import { v4 as uuidv4 } from "uuid";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx): Promise<NextResponse<ApiResponse<Review>>> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "buyer") return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const { id: order_id } = await ctx.params;
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("buyer_id, items, status")
      .eq("id", order_id)
      .single();

    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    if (order.buyer_id !== user.sub) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    if (order.status !== "shipped") return NextResponse.json({ error: "Can only review shipped orders." }, { status: 400 });

    const { product_id, rating, comment } = await req.json();
    if (!product_id || !rating || !comment) return NextResponse.json({ error: "product_id, rating and comment are required." }, { status: 400 });
    if (rating < 1 || rating > 5) return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });

    const itemBelongsToOrder = order.items.some((i: any) => i.product_id === product_id);
    if (!itemBelongsToOrder) return NextResponse.json({ error: "Product not in this order." }, { status: 400 });

    const { data: existing } = await supabaseAdmin
      .from("reviews")
      .select("id")
      .eq("order_id", order_id)
      .eq("product_id", product_id)
      .single();
    if (existing) return NextResponse.json({ error: "Already reviewed this product." }, { status: 409 });

    const review: Review = {
      id: uuidv4(),
      order_id,
      product_id,
      buyer_id: user.sub,
      buyer_name: user.name,
      rating: parseInt(rating),
      comment: comment.trim(),
      created_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin.from("reviews").insert(review);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data: review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function GET(_req: NextRequest, ctx: Ctx): Promise<NextResponse<ApiResponse<Review[]>>> {
  try {
    const { id: order_id } = await ctx.params;
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .eq("order_id", order_id)
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: data || [] });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
