import type { Metadata } from "next";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";
import { User } from "@/types";
import Navbar from "@/components/ui/Navbar";
import { AuthProvider } from "@/components/ui/AuthProvider";

export const metadata: Metadata = {
  title: "Shopwise",
  description: "A simple e-commerce platform for buyers and sellers.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let user: User | null = null;
  try {
    const jwt = await getCurrentUser();
    if (jwt) user = { id: jwt.sub, email: jwt.email, name: jwt.name, role: jwt.role, created_at: "" };
  } catch {}

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 antialiased">
        <AuthProvider initialUser={user}>
          <Navbar user={user} />
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
