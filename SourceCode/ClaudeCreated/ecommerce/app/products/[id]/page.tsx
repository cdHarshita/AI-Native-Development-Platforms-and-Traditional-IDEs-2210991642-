"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product, Review } from "@/types";
import { addToCart } from "@/lib/cart";
import { useAuth } from "@/components/ui/AuthProvider";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [pRes, rRes] = await Promise.all([
        fetch(`/api/products/${id}`),
        fetch(`/api/reviews?product_id=${id}`),
      ]);
      const pJson = await pRes.json();
      const rJson = await rRes.json();
      setProduct(pJson.data || null);
      setReviews(rJson.data || []);
      setLoading(false);
    }
    load();
  }, [id]);

  function handleAddToCart() {
    if (!user) { router.push("/auth/login"); return; }
    if (!product) return;
    addToCart({ product_id: product.id, name: product.name, price: product.price, quantity: 1, image_url: product.image_url, stock: product.stock });
    setToast("Added to cart!");
    setTimeout(() => setToast(null), 2000);
  }

  if (loading) return <div className="animate-pulse h-96 bg-white dark:bg-slate-800 rounded-2xl" />;
  if (!product) return <div className="text-center py-20 text-gray-400">Product not found.</div>;

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="aspect-square bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 dark:border-slate-700">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <div className="text-7xl">🛍️</div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{product.category}</span>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{product.name}</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Sold by {product.seller_name}</p>
            {avgRating && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-amber-400">★</span>
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{avgRating}</span>
                <span className="text-xs text-gray-400">({reviews.length} reviews)</span>
              </div>
            )}
          </div>

          <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">{product.description}</p>

          <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 dark:border-slate-700">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
            <span className="text-sm text-gray-400">{product.stock} in stock</span>
          </div>

          {user?.role !== "seller" && (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-medium rounded-xl transition-colors"
            >
              {product.stock === 0 ? "Out of stock" : "Add to cart"}
            </button>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-slate-500">No reviews yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-slate-200">{r.buyer_name}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < r.rating ? "text-amber-400" : "text-gray-200 dark:text-slate-600"}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-300">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
