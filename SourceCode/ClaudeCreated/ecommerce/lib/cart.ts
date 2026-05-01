import { Cart, CartItem } from "@/types";

const CART_KEY = "ecommerce_cart_v1";

export function getCart(): Cart {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
}

export function saveCart(cart: Cart): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(item: CartItem): Cart {
  const cart = getCart();
  const existing = cart.items.find((i) => i.product_id === item.product_id);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + item.quantity, item.stock);
  } else {
    cart.items.push(item);
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(product_id: string): Cart {
  const cart = getCart();
  cart.items = cart.items.filter((i) => i.product_id !== product_id);
  saveCart(cart);
  return cart;
}

export function updateQuantity(product_id: string, quantity: number): Cart {
  const cart = getCart();
  const item = cart.items.find((i) => i.product_id === product_id);
  if (item) {
    if (quantity <= 0) return removeFromCart(product_id);
    item.quantity = Math.min(quantity, item.stock);
  }
  saveCart(cart);
  return cart;
}

export function clearCart(): Cart {
  const empty: Cart = { items: [] };
  saveCart(empty);
  return empty;
}

export function cartTotal(cart: Cart): number {
  return cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
