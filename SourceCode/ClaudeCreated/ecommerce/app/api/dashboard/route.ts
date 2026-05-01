import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { ApiResponse, DashboardStats } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse<DashboardStats>>> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "seller") return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const [ordersRes, productsRes] = await Promise.all([
      supabaseAdmin.from("orders").select("*").eq("seller_id", user.sub).order("created_at", { ascending: false }),
      supabaseAdmin.from("products").select("id").eq("seller_id", user.sub),
    ]);

    const orders = ordersRes.data || [];
    const total_revenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    const pending_orders = orders.filter((o: any) => o.status === "pending").length;

    return NextResponse.json({
      data: {
        total_revenue: parseFloat(total_revenue.toFixed(2)),
        total_orders: orders.length,
        pending_orders,
        total_products: (productsRes.data || []).length,
        recent_orders: orders.slice(0, 5),
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
