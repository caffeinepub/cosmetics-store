import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ShoppingCart {
    items: Array<CartItem>;
}
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export type Time = bigint;
export interface Order {
    id: bigint;
    status: string;
    timestamp: Time;
    items: Array<CartItem>;
    totalPrice: bigint;
}
export interface Product {
    id: bigint;
    featured: boolean;
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: string;
    price: bigint;
}
export interface backendInterface {
    addProduct(name: string, category: string, description: string, price: bigint, imageUrl: string, stock: bigint, featured: boolean): Promise<bigint>;
    addToCart(sessionId: string, productId: bigint, quantity: bigint): Promise<void>;
    clearCart(sessionId: string): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getCart(sessionId: string): Promise<ShoppingCart>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getOrders(): Promise<Array<Order>>;
    getProductById(id: bigint): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
    placeOrder(sessionId: string): Promise<bigint>;
    removeFromCart(sessionId: string, productId: bigint): Promise<void>;
    updateCartItem(sessionId: string, productId: bigint, quantity: bigint): Promise<void>;
    updateProduct(id: bigint, name: string, category: string, description: string, price: bigint, imageUrl: string, stock: bigint, featured: boolean): Promise<void>;
}
