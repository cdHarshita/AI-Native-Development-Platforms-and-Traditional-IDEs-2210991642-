"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useAuth } from "@/components/ui/AuthProvider";

export default function SellerProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/products?seller_id=${user.id}`)
      .then((r) => r.json())
      .then((j) => { setProducts(j.data || []); setLoading(false); });
  }, [user]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) setProducts(products.filter((p) => p.id !== id));
  }

  if (loading) return <div className="animate-pulse h-40 bg-white dark:bg-slate-800 rounded-2xl" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Products</h1>
        <Link href="/seller/products/new" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-slate-500">
          <div className="text-5xl mb-3">📦</div>
          <p className="text-sm mb-4">No products yet.</p>
          <Link href="/seller/products/new" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Add your first product</Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden">
          {products.map((p, idx) => (
            <div key={p.id} className={`flex items-center gap-4 px-5 py-4 ${idx !== products.length - 1 ? "border-b border-gray-100 dark:border-slate-700" : ""}`}>
              <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-xl">🛍️</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.name}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">{p.category} · {p.stock} in stock</p>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">${p.price.toFixed(2)}</span>
              <div className="flex gap-2">
                <Link href={`/seller/products/${p.id}`} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Edit</Link>
                <button onClick={() => handleDelete(p.id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
