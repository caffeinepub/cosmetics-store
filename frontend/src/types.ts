// Local type definitions for the cosmetics store.
// These mirror the backend data structures but are defined locally
// since the generated backend interface only exposes admin mutation methods.

export interface Product {
  id: bigint;
  name: string;
  category: string;
  description: string;
  price: bigint;
  imageUrl: string;
  stock: bigint;
  featured: boolean;
}

export interface CartItem {
  productId: bigint;
  quantity: bigint;
}

export interface ShoppingCart {
  items: CartItem[];
}

export interface Order {
  id: bigint;
  items: CartItem[];
  totalPrice: bigint;
  status: string;
  timestamp: bigint;
}

export interface SiteSettings {
  heroBannerImageUrl: string;
  storeName: string;
  contactEmail: string;
  address: string;
  currency: string;
  shopifyStoreDomain: string;
  shopifyStorefrontAccessToken: string;
  shopifyEnabled: boolean;
  colorScheme: string;
}
