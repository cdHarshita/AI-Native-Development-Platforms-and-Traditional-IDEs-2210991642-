"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/types";

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  }

  const buyerLinks = [
    { href: "/", label: "Shop" },
    { href: "/cart", label: "Cart" },
    { href: "/orders", label: "My Orders" },
  ];

  const sellerLinks = [
    { href: "/seller/dashboard", label: "Dashboard" },
    { href: "/seller/products", label: "My Products" },
    { href: "/seller/orders", label: "Orders" },
  ];

  const links = user?.role === "seller" ? sellerLinks : user?.role === "buyer" ? buyerLinks : [];

  return (
    <nav className="border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold text-gray-900 dark:text-white tracking-tight">
          Shopwise
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname === href
                  ? "bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white font-medium"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs text-gray-400 dark:text-slate-500 hidden sm:block">
                {user.name} · <span className="capitalize">{user.role}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/auth/register" className="text-sm px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
