"use client";

import { useEffect, useState } from "react";
import { Order, Review } from "@/types";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState<{ orderId: string; productId: string; productName: string } | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/orders").then((r) => r.json()).then((j) => { setOrders(j.data || []); setLoading(false); });
  }, []);

  async function submitReview() {
    if (!reviewModal) return;
    setSubmitting(true);
    const res = await fetch(`/api/orders/${reviewModal.orderId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: reviewModal.productId, ...reviewForm }),
    });
    const json = await res.json();
    if (res.ok) {
      setReviewModal(null);
      setReviewForm({ rating: 5, comment: "" });
    } else {
      alert(json.error || "Failed to submit review.");
    }
    setSubmitting(false);
  }

  if (loading) return <div className="animate-pulse h-40 bg-white dark:bg-slate-800 rounded-2xl" />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-slate-500">
          <div className="text-5xl mb-3">📦</div>
          <p className="text-sm">No orders yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400 dark:text-slate-500 font-mono">{order.id.slice(0, 8)}...</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="flex flex-col gap-2 mb-3">
                {order.items.map((item) => (
                  <div key={item.product_id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-slate-300">{item.name} × {item.quantity}</span>
                    <span className="text-gray-900 dark:text-white font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Total: ${order.total.toFixed(2)}</span>
                {order.status === "shipped" && (
                  <div className="flex gap-2">
                    {order.items.map((item) => (
                      <button
                        key={item.product_id}
                        onClick={() => setReviewModal({ orderId: order.id, productId: item.product_id, productName: item.name })}
                        className="text-xs px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 transition-colors"
                      >
                        Review {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Leave a Review</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-5">{reviewModal.productName}</p>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button key={r} onClick={() => setReviewForm({ ...reviewForm, rating: r })} className={`text-2xl transition-transform hover:scale-110 ${r <= reviewForm.rating ? "text-amber-400" : "text-gray-200 dark:text-slate-600"}`}>★</button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">Comment</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Share your experience..."
              />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setReviewModal(null)} className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 text-sm text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
              <button onClick={submitReview} disabled={submitting || !reviewForm.comment.trim()} className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium transition-colors">{submitting ? "Submitting..." : "Submit"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
