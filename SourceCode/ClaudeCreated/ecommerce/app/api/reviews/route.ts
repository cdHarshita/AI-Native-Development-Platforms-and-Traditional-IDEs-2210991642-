import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { ApiResponse, Review } from "@/types";

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<Review[]>>> {
  try {
    const { searchParams } = new URL(req.url);
    const product_id = searchParams.get("product_id");
    if (!product_id) return NextResponse.json({ error: "product_id is required." }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .eq("product_id", product_id)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data: data || [] });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
