import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SiteSettings {
    promoBannerText: string;
    shopifyStoreDomain: string;
    promoBannerEnabled: boolean;
    currency: string;
    address: string;
    storeName: string;
    contactEmail: string;
    shopifyStorefrontAccessToken: string;
    heroBannerImageUrl: string;
    shopifyEnabled: boolean;
    colorScheme: string;
}
export interface UserProfile {
    name: string;
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProducts(): Promise<Array<Product>>;
    getSiteSettings(): Promise<SiteSettings>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    importShopifyProduct(title: string, category: string, description: string, price: bigint, imageUrl: string, stock: bigint, featured: boolean): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateSiteSettings(newSettings: SiteSettings): Promise<void>;
}
