import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { ApiResponse, Order, CartItem } from "@/types";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<Order[]>>> {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    let query = supabaseAdmin.from("orders").select("*, users!orders_buyer_id_fkey(name, email)").order("created_at", { ascending: false });

    if (user.role === "buyer") query = query.eq("buyer_id", user.sub);
    if (user.role === "seller") query = query.eq("seller_id", user.sub);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const orders: Order[] = (data || []).map((o: any) => ({
      ...o,
      buyer_name: o.users?.name,
      buyer_email: o.users?.email,
      users: undefined,
    }));

    return NextResponse.json({ data: orders });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<Order[]>>> {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    if (user.role !== "buyer") return NextResponse.json({ error: "Only buyers can place orders." }, { status: 403 });

    const { items }: { items: CartItem[] } = await req.json();
    if (!items || items.length === 0) return NextResponse.json({ error: "Cart is empty." }, { status: 400 });

    // Group items by seller
    const productIds = items.map((i) => i.product_id);
    const { data: products, error: pErr } = await supabaseAdmin
      .from("products")
      .select("id, seller_id, stock, price")
      .in("id", productIds);

    if (pErr || !products) return NextResponse.json({ error: "Failed to validate products." }, { status: 500 });

    // Validate stock
    for (const item of items) {
      const product = products.find((p) => p.id === item.product_id);
      if (!product) return NextResponse.json({ error: `Product ${item.name} not found.` }, { status: 400 });
      if (product.stock < item.quantity) return NextResponse.json({ error: `Insufficient stock for ${item.name}.` }, { status: 400 });
    }

    // Group by seller_id
    const sellerMap: Record<string, CartItem[]> = {};
    for (const item of items) {
      const product = products.find((p) => p.id === item.product_id)!;
      if (!sellerMap[product.seller_id]) sellerMap[product.seller_id] = [];
      sellerMap[product.seller_id].push(item);
    }

    const now = new Date().toISOString();
    const createdOrders: Order[] = [];

    for (const [seller_id, sellerItems] of Object.entries(sellerMap)) {
      const total = sellerItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const order: Order = {
        id: uuidv4(),
        buyer_id: user.sub,
        seller_id,
        items: sellerItems.map((i) => ({ product_id: i.product_id, name: i.name, price: i.price, quantity: i.quantity })),
        total: parseFloat(total.toFixed(2)),
        status: "pending",
        created_at: now,
        updated_at: now,
      };

      const { error: oErr } = await supabaseAdmin.from("orders").insert(order);
      if (oErr) return NextResponse.json({ error: "Failed to create order." }, { status: 500 });

      // Decrement stock
      for (const item of sellerItems) {
        const product = products.find((p) => p.id === item.product_id)!;
        await supabaseAdmin.from("products").update({ stock: product.stock - item.quantity }).eq("id", item.product_id);
      }

      createdOrders.push(order);
    }

    return NextResponse.json({ data: createdOrders }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
