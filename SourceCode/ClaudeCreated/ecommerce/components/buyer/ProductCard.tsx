"use client";

import Link from "next/link";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showActions?: boolean;
}

export default function ProductCard({ product, onAddToCart, showActions = true }: ProductCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square bg-gray-50 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-4xl text-gray-200 dark:text-slate-600">🛍️</div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{product.category}</span>
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mt-0.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">by {product.seller_name}</p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-semibold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
          <span className="text-xs text-gray-400 dark:text-slate-500">{product.stock} left</span>
        </div>

        {showActions && onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="w-full mt-1 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
          >
            {product.stock === 0 ? "Out of stock" : "Add to cart"}
          </button>
        )}
      </div>
    </div>
  );
}
