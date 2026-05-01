"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";

const CATEGORIES = ["Electronics", "Clothing", "Books", "Home", "Sports", "Other"];

interface ProductFormProps {
  initial?: Partial<Product>;
  productId?: string;
}

export default function ProductForm({ initial, productId }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    price: initial?.price?.toString() || "",
    stock: initial?.stock?.toString() || "",
    image_url: initial?.image_url || "",
    category: initial?.category || "Electronics",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const url = productId ? `/api/products/${productId}` : "/api/products";
      const method = productId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Failed to save product."); return; }
      router.push("/seller/products");
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="max-w-lg">
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 flex flex-col gap-4">

        {[
          { label: "Product Name", key: "name", type: "text", placeholder: "e.g. Wireless Headphones" },
          { label: "Price ($)", key: "price", type: "number", placeholder: "0.00" },
          { label: "Stock", key: "stock", type: "number", placeholder: "0" },
          { label: "Image URL (optional)", key: "image_url", type: "url", placeholder: "https://..." },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">{label}</label>
            <input type={type} value={(form as any)[key]} onChange={f(key)} required={key !== "image_url"}
              step={key === "price" ? "0.01" : "1"} min={key === "price" ? "0.01" : "0"}
              placeholder={placeholder}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">Category</label>
          <select value={form.category} onChange={f("category")} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">Description</label>
          <textarea value={form.description} onChange={f("description")} required rows={3} placeholder="Describe your product..."
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex gap-2 pt-1">
          <button type="button" onClick={() => router.back()} className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium transition-colors">
            {loading ? "Saving..." : productId ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    </form>
  );
}
