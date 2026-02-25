import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { getSessionId } from '../utils/session';
import type { SiteSettings as BackendSiteSettings } from '../backend';
import type { Product, ShoppingCart, SiteSettings } from '../types';

// The generated backend interface only includes admin methods.
// We cast the actor to access the full runtime API for read/cart/order operations.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FullActor = any;

const defaultSiteSettings: SiteSettings = {
  heroBannerImageUrl: '',
  storeName: '',
  contactEmail: '',
  address: '',
  currency: '',
  shopifyStoreDomain: '',
  shopifyStorefrontAccessToken: '',
  shopifyEnabled: false,
  colorScheme: 'default',
  promoBannerText: '',
  promoBannerEnabled: true,
};

// ─── Products ────────────────────────────────────────────────────────────────

export function useGetProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as FullActor).getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['featured-products'],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as FullActor).getFeaturedProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product | null>({
    queryKey: ['product', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return (actor as FullActor).getProductById(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

// ─── Admin Product Mutations ──────────────────────────────────────────────────

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  featured: boolean;
}

export function useAddProduct() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProductFormData) => {
      if (!identity) throw new Error('Not authenticated: please log in to perform this action');
      if (!actor) throw new Error('Actor not ready');
      return (actor as FullActor).addProduct(
        data.name,
        data.category,
        data.description,
        BigInt(Math.round(data.price * 100)),
        data.imageUrl,
        BigInt(data.stock),
        data.featured,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: bigint; data: ProductFormData }) => {
      if (!identity) throw new Error('Not authenticated: please log in to perform this action');
      if (!actor) throw new Error('Actor not ready');
      return (actor as FullActor).updateProduct(
        id,
        data.name,
        data.category,
        data.description,
        BigInt(Math.round(data.price * 100)),
        data.imageUrl,
        BigInt(data.stock),
        data.featured,
      );
    },
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id.toString()] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!identity) throw new Error('Not authenticated: please log in to perform this action');
      if (!actor) throw new Error('Actor not ready');
      return (actor as FullActor).deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
    },
  });
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export function useGetSiteSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<SiteSettings>({
    queryKey: ['site-settings'],
    queryFn: async (): Promise<SiteSettings> => {
      if (!actor) return defaultSiteSettings;
      try {
        const result = await actor.getSiteSettings();
        return {
          heroBannerImageUrl: result.heroBannerImageUrl ?? '',
          storeName: result.storeName ?? '',
          contactEmail: result.contactEmail ?? '',
          address: result.address ?? '',
          currency: result.currency ?? '',
          shopifyStoreDomain: result.shopifyStoreDomain ?? '',
          shopifyStorefrontAccessToken: result.shopifyStorefrontAccessToken ?? '',
          shopifyEnabled: result.shopifyEnabled ?? false,
          colorScheme: result.colorScheme ?? 'default',
          promoBannerText: result.promoBannerText ?? '',
          promoBannerEnabled: result.promoBannerEnabled ?? true,
        };
      } catch {
        return defaultSiteSettings;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSiteSettings() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSettings: SiteSettings) => {
      // Guard: must be authenticated before calling the backend
      if (!identity) {
        throw new Error('Please log in to save settings');
      }
      if (!actor) throw new Error('Actor not ready');

      // Explicitly construct the payload matching the backend SiteSettings record
      // to ensure all fields are included in Candid encoding
      const payload: BackendSiteSettings = {
        heroBannerImageUrl: newSettings.heroBannerImageUrl,
        storeName: newSettings.storeName,
        contactEmail: newSettings.contactEmail,
        address: newSettings.address,
        currency: newSettings.currency,
        shopifyStoreDomain: newSettings.shopifyStoreDomain,
        shopifyStorefrontAccessToken: newSettings.shopifyStorefrontAccessToken,
        shopifyEnabled: newSettings.shopifyEnabled,
        colorScheme: newSettings.colorScheme,
        promoBannerText: newSettings.promoBannerText,
        promoBannerEnabled: newSettings.promoBannerEnabled,
      };
      return actor.updateSiteSettings(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
  });
}

// ─── Shopify Import ───────────────────────────────────────────────────────────

export interface ShopifyImportData {
  title: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  featured: boolean;
}

export function useImportShopifyProduct() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ShopifyImportData) => {
      if (!identity) throw new Error('Not authenticated: please log in to perform this action');
      if (!actor) throw new Error('Actor not ready');
      return actor.importShopifyProduct(
        data.title,
        data.category,
        data.description,
        BigInt(Math.round(data.price * 100)),
        data.imageUrl,
        BigInt(data.stock),
        data.featured,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
    },
  });
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export function useGetCart() {
  const { actor, isFetching } = useActor();
  const sessionId = getSessionId();
  return useQuery<ShoppingCart>({
    queryKey: ['cart', sessionId],
    queryFn: async () => {
      if (!actor) return { items: [] };
      return (actor as FullActor).getCart(sessionId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionId = getSessionId();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: bigint; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not ready');
      return (actor as FullActor).addToCart(sessionId, productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', sessionId] });
    },
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionId = getSessionId();

  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error('Actor not ready');
      return (actor as FullActor).removeFromCart(sessionId, productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', sessionId] });
    },
  });
}

export function useUpdateCartItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionId = getSessionId();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: bigint; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not ready');
      return (actor as FullActor).updateCartItem(sessionId, productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', sessionId] });
    },
  });
}

export function useClearCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionId = getSessionId();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      return (actor as FullActor).clearCart(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', sessionId] });
    },
  });
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionId = getSessionId();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      return (actor as FullActor).placeOrder(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', sessionId] });
    },
  });
}
