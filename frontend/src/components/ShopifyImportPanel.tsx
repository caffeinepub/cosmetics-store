import { useState } from 'react';
import { ShoppingBag, Download, AlertCircle, PackageSearch, Loader2, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useImportShopifyProduct } from '../hooks/useQueries';
import { fetchShopifyProducts, type ShopifyProduct } from '../utils/shopifyApi';
import type { SiteSettings } from '../types';
import { useQuery } from '@tanstack/react-query';

interface ShopifyImportPanelProps {
  siteSettings: SiteSettings | undefined;
  onGoToSettings: () => void;
}

function formatPrice(amount: string, currencyCode: string): string {
  const num = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode || 'USD',
  }).format(num);
}

function ProductCardSkeleton() {
  return (
    <Card className="border-blush-deep/20 overflow-hidden">
      <Skeleton className="w-full aspect-square bg-blush/30" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4 bg-blush/30" />
        <Skeleton className="h-3 w-1/2 bg-blush/20" />
        <Skeleton className="h-3 w-full bg-blush/20" />
        <Skeleton className="h-3 w-5/6 bg-blush/20" />
        <Skeleton className="h-9 w-full mt-3 bg-blush/30 rounded-lg" />
      </CardContent>
    </Card>
  );
}

interface ShopifyProductCardProps {
  product: ShopifyProduct;
  onImport: (product: ShopifyProduct) => void;
  isImporting: boolean;
}

function ShopifyProductCard({ product, onImport, isImporting }: ShopifyProductCardProps) {
  const imageUrl = product.images.edges[0]?.node.url ?? '';
  const imageAlt = product.images.edges[0]?.node.altText ?? product.title;
  const price = product.priceRange.minVariantPrice;
  const maxPrice = product.priceRange.maxVariantPrice;
  const hasRange = price.amount !== maxPrice.amount;

  return (
    <Card className="border-blush-deep/20 shadow-card overflow-hidden flex flex-col group hover:shadow-glow transition-shadow duration-200">
      {/* Product Image */}
      <div className="relative aspect-square bg-blush/10 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PackageSearch className="w-12 h-12 text-blush-deep/30" />
          </div>
        )}
        {product.productType && (
          <div className="absolute top-2 left-2">
            <Badge
              variant="secondary"
              className="font-sans text-xs bg-white/80 text-foreground/70 border-blush-deep/20 backdrop-blur-sm"
            >
              {product.productType}
            </Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <CardContent className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-serif text-base font-semibold text-foreground leading-snug line-clamp-2">
          {product.title}
        </h3>

        <p className="font-sans text-xs text-muted-foreground line-clamp-2 flex-1">
          {product.description || 'No description available.'}
        </p>

        <div className="flex items-center justify-between mt-1">
          <span className="font-sans text-sm font-semibold text-rose-dark">
            {formatPrice(price.amount, price.currencyCode)}
            {hasRange && (
              <span className="text-muted-foreground font-normal">
                {' '}– {formatPrice(maxPrice.amount, maxPrice.currencyCode)}
              </span>
            )}
          </span>
        </div>

        <Button
          size="sm"
          onClick={() => onImport(product)}
          disabled={isImporting}
          className="w-full mt-2 bg-rose-dark hover:bg-rose-dark/90 text-ivory font-sans text-xs"
        >
          {isImporting ? (
            <>
              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
              Importing…
            </>
          ) : (
            <>
              <Download className="w-3 h-3 mr-1.5" />
              Import Product
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ShopifyImportPanel({ siteSettings, onGoToSettings }: ShopifyImportPanelProps) {
  const importProduct = useImportShopifyProduct();
  const [importingId, setImportingId] = useState<string | null>(null);

  const isConfigured =
    siteSettings?.shopifyEnabled &&
    siteSettings?.shopifyStoreDomain?.trim() !== '' &&
    siteSettings?.shopifyStorefrontAccessToken?.trim() !== '';

  const {
    data: shopifyProducts,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<ShopifyProduct[]>({
    queryKey: [
      'shopify-products',
      siteSettings?.shopifyStoreDomain,
      siteSettings?.shopifyStorefrontAccessToken,
    ],
    queryFn: async () => {
      if (!siteSettings?.shopifyStoreDomain || !siteSettings?.shopifyStorefrontAccessToken) {
        return [];
      }
      return fetchShopifyProducts(
        siteSettings.shopifyStoreDomain,
        siteSettings.shopifyStorefrontAccessToken,
      );
    },
    enabled: !!isConfigured,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleImport = async (product: ShopifyProduct) => {
    setImportingId(product.id);
    try {
      const price = parseFloat(product.priceRange.minVariantPrice.amount);
      const imageUrl = product.images.edges[0]?.node.url ?? '';
      const category = product.productType || 'Uncategorized';

      await importProduct.mutateAsync({
        title: product.title,
        category,
        description: product.description || '',
        price,
        imageUrl,
        stock: 100,
        featured: false,
      });

      toast.success(`"${product.title}" imported successfully!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Import failed';
      toast.error(msg);
    } finally {
      setImportingId(null);
    }
  };

  // Not configured state
  if (!isConfigured) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#96bf48]/10 flex items-center justify-center mb-5">
          <ShoppingBag className="w-8 h-8 text-[#96bf48]" />
        </div>
        <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
          Shopify Not Configured
        </h2>
        <p className="font-sans text-sm text-muted-foreground mb-6 leading-relaxed">
          {!siteSettings?.shopifyEnabled
            ? 'Shopify integration is currently disabled. Enable it in Site Settings and add your store credentials to start importing products.'
            : 'Your Shopify store domain and access token are required. Configure them in Site Settings to continue.'}
        </p>
        <Button
          onClick={onGoToSettings}
          variant="outline"
          className="border-blush-deep/40 hover:bg-blush/50 font-sans gap-2"
        >
          <Settings2 className="w-4 h-4" />
          Go to Site Settings
        </Button>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-serif">Failed to fetch Shopify products</AlertTitle>
          <AlertDescription className="font-sans text-sm">
            {error instanceof Error ? error.message : 'An unexpected error occurred.'}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-blush-deep/40 hover:bg-blush/50 font-sans"
          >
            <Loader2 className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-serif text-lg font-semibold text-foreground">
              Shopify Products
            </h2>
            {!isLoading && shopifyProducts && (
              <Badge
                variant="secondary"
                className="font-sans text-xs bg-blush/40 text-foreground/70 border-blush-deep/20"
              >
                {shopifyProducts.length} product{shopifyProducts.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <p className="font-sans text-sm text-muted-foreground">
            Fetched from{' '}
            <span className="font-medium text-foreground/70">
              {siteSettings?.shopifyStoreDomain}
            </span>
            . Click Import to add a product to your ICP store catalog.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="border-blush-deep/40 text-foreground/70 hover:bg-blush/50 font-sans shrink-0"
        >
          <Loader2 className={`w-4 h-4 mr-1.5 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : shopifyProducts && shopifyProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {shopifyProducts.map((product) => (
            <ShopifyProductCard
              key={product.id}
              product={product}
              onImport={handleImport}
              isImporting={importingId === product.id}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blush/30 flex items-center justify-center mb-4">
            <PackageSearch className="w-8 h-8 text-blush-deep/40" />
          </div>
          <p className="font-serif text-xl text-foreground/60 mb-2">No products found</p>
          <p className="font-sans text-sm text-foreground/40">
            Your Shopify store doesn't have any published products yet.
          </p>
        </div>
      )}
    </div>
  );
}
