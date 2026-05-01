"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [shipping, setShipping] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((j) => { setOrders(j.data || []); setLoading(false); });
  }, []);

  async function handleShip(orderId: string) {
    setShipping(orderId);
    const res = await fetch(`/api/orders/${orderId}/ship`, { method: "PATCH" });
    const json = await res.json();
    if (res.ok && json.data) {
      setOrders(orders.map((o) => o.id === orderId ? { ...o, status: "shipped" } : o));
    } else {
      alert(json.error || "Failed to update order.");
    }
    setShipping(null);
  }

  if (loading) return <div className="animate-pulse h-40 bg-white dark:bg-slate-800 rounded-2xl" />;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-slate-500">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-sm">No orders yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-mono text-gray-400 dark:text-slate-500">{order.id.slice(0, 8)}...</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-slate-200 mt-0.5">
                    {order.buyer_name || "Buyer"}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-slate-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  {order.status === "pending" && (
                    <button
                      onClick={() => handleShip(order.id)}
                      disabled={shipping === order.id}
                      className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium transition-colors"
                    >
                      {shipping === order.id ? "Updating..." : "Mark Shipped"}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-3">
                {order.items.map((item) => (
                  <div key={item.product_id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-300">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-slate-700 flex justify-end">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Total: ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
