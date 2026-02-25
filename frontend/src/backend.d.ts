import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface backendInterface {
    addProduct(name: string, category: string, description: string, price: bigint, imageUrl: string, stock: bigint, featured: boolean): Promise<bigint>;
    deleteProduct(id: bigint): Promise<void>;
    updateProduct(id: bigint, name: string, category: string, description: string, price: bigint, imageUrl: string, stock: bigint, featured: boolean): Promise<void>;
}
