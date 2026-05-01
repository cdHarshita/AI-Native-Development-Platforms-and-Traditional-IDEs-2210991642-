import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { ApiResponse, Product } from "@/types";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<Product[]>>> {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const seller_id = searchParams.get("seller_id") || "";

    let query = supabaseAdmin
      .from("products")
      .select("*, users(name)")
      .gt("stock", 0)
      .order("created_at", { ascending: false });

    if (search) query = query.ilike("name", `%${search}%`);
    if (category) query = query.eq("category", category);
    if (seller_id) query = query.eq("seller_id", seller_id);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const products: Product[] = (data || []).map((p: any) => ({
      ...p,
      seller_name: p.users?.name,
      users: undefined,
    }));

    return NextResponse.json({ data: products });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<Product>>> {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    if (user.role !== "seller") return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const { name, description, price, stock, image_url, category } = await req.json();

    if (!name || !description || price == null || stock == null || !category) {
      return NextResponse.json({ error: "All fields required." }, { status: 400 });
    }
    if (price <= 0) return NextResponse.json({ error: "Price must be positive." }, { status: 400 });
    if (stock < 0) return NextResponse.json({ error: "Stock cannot be negative." }, { status: 400 });

    const now = new Date().toISOString();
    const product: Product = {
      id: uuidv4(),
      seller_id: user.sub,
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      stock: parseInt(stock),
      image_url: image_url?.trim() || null,
      category: category.trim(),
      created_at: now,
      updated_at: now,
    };

    const { error } = await supabaseAdmin.from("products").insert(product);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
