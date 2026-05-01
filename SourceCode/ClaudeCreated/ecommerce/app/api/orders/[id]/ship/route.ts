import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { ApiResponse, Order } from "@/types";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(_req: NextRequest, ctx: Ctx): Promise<NextResponse<ApiResponse<Order>>> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "seller") return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const { id } = await ctx.params;
    const { data: order } = await supabaseAdmin.from("orders").select("seller_id, status").eq("id", id).single();
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    if (order.seller_id !== user.sub) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    if (order.status !== "pending") return NextResponse.json({ error: "Only pending orders can be shipped." }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status: "shipped", updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
