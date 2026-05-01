"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/types";
import ProductForm from "@/components/seller/ProductForm";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((j) => { setProduct(j.data || null); setLoading(false); });
  }, [id]);

  if (loading) return <div className="animate-pulse h-96 bg-white dark:bg-slate-800 rounded-2xl" />;
  if (!product) return <p className="text-gray-400 text-sm">Product not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Edit Product</h1>
      <ProductForm initial={product} productId={product.id} />
    </div>
  );
}
