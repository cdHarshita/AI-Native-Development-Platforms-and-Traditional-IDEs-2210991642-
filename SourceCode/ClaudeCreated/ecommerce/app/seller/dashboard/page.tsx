"use client";

import { useEffect, useState } from "react";
import { DashboardStats } from "@/types";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard").then((r) => r.json()).then((j) => { setStats(j.data || null); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 animate-pulse" />)}
    </div>
  );

  if (!stats) return <p className="text-gray-400 text-sm">Failed to load dashboard.</p>;

  const statCards = [
    { label: "Total Revenue", value: `$${stats.total_revenue.toFixed(2)}` },
    { label: "Total Orders", value: stats.total_orders },
    { label: "Pending Orders", value: stats.pending_orders },
    { label: "Products Listed", value: stats.total_products },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <Link href="/seller/products/new" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
          + New Product
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value }) => (
          <div key={label} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-4">
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-1">{label}</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-800 dark:text-slate-200 mb-3">Recent Orders</h2>
        {stats.recent_orders.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-slate-500">No orders yet.</p>
        ) : (
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden">
            {stats.recent_orders.map((order, idx) => (
              <div key={order.id} className={`flex items-center justify-between px-5 py-3.5 ${idx !== stats.recent_orders.length - 1 ? "border-b border-gray-100 dark:border-slate-700" : ""}`}>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-slate-200 font-mono">{order.id.slice(0, 8)}...</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <OrderStatusBadge status={order.status} />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">${order.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
