export function getHeroImage(): string {
  return '/assets/generated/hero-banner.dim_1400x500.png';
}

export function getProductPlaceholder(): string {
  return '/assets/generated/product-placeholder.dim_600x600.png';
}

export function getPromoBanner(): string {
  return '/assets/generated/promo-banner.dim_1400x120.png';
}

export function getProductImage(imageUrl: string): string {
  if (!imageUrl || imageUrl.trim() === '') {
    return getProductPlaceholder();
  }
  return imageUrl;
}
