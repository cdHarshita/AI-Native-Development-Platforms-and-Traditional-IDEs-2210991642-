"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cart, CartItem } from "@/types";
import { getCart, removeFromCart, updateQuantity, clearCart, cartTotal } from "@/lib/cart";
import { useAuth } from "@/components/ui/AuthProvider";

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCart(getCart());
    setMounted(true);
  }, []);

  function handleRemove(product_id: string) { setCart(removeFromCart(product_id)); }
  function handleQty(product_id: string, qty: number) { setCart(updateQuantity(product_id, qty)); }

  async function handleCheckout() {
    if (!user) { router.push("/auth/login"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.items }),
      });
      const json = await res.json();
      if (!res.ok) { alert(json.error || "Checkout failed."); return; }
      setCart(clearCart());
      router.push("/orders");
    } catch {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  const total = cartTotal(cart);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Your Cart</h1>

      {cart.items.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🛒</div>
          <p className="text-gray-400 dark:text-slate-500 text-sm mb-4">Your cart is empty</p>
          <button onClick={() => router.push("/")} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            Continue shopping
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden mb-4">
            {cart.items.map((item: CartItem, idx) => (
              <div key={item.product_id} className={`flex items-center gap-4 p-4 ${idx !== cart.items.length - 1 ? "border-b border-gray-100 dark:border-slate-700" : ""}`}>
                <div className="w-16 h-16 rounded-lg bg-gray-50 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-2xl">🛍️</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleQty(item.product_id, item.quantity - 1)} className="w-7 h-7 rounded-lg border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 text-sm">−</button>
                  <span className="text-sm font-medium w-6 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                  <button onClick={() => handleQty(item.product_id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="w-7 h-7 rounded-lg border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 text-sm">+</button>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white w-16 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => handleRemove(item.product_id)} className="text-gray-300 dark:text-slate-600 hover:text-red-400 transition-colors ml-1">✕</button>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500 dark:text-slate-400">Total</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
            >
              {loading ? "Placing order..." : "Place Order"}
            </button>
            <p className="mt-2 text-center text-xs text-gray-400 dark:text-slate-500">No payment required — order placed instantly</p>
          </div>
        </>
      )}
    </div>
  );
}
