import { useState } from 'react';
import { Plus, RefreshCw, Settings2, Package, Sliders, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductTable from '../components/ProductTable';
import ProductFormDialog from '../components/ProductFormDialog';
import SiteSettingsSection from '../components/SiteSettingsSection';
import ShopifyImportPanel from '../components/ShopifyImportPanel';
import { useGetProducts, useGetSiteSettings } from '../hooks/useQueries';

export default function AdminPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const { data: products, isLoading, isError, refetch, isFetching } = useGetProducts();
  const { data: siteSettings } = useGetSiteSettings();

  return (
    <main className="min-h-screen bg-ivory">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blush/60 to-ivory border-b border-blush-deep/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-dark/10 flex items-center justify-center">
                <Settings2 className="w-5 h-5 text-rose-dark" />
              </div>
              <div>
                <h1 className="font-serif text-2xl md:text-3xl font-semibold text-rose-dark">
                  Admin Panel
                </h1>
                <p className="font-sans text-sm text-foreground/60 mt-0.5">
                  Manage your store and settings
                </p>
              </div>
            </div>

            {activeTab === 'products' && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="border-blush-deep/40 text-foreground/70 hover:bg-blush/50 font-sans"
                >
                  <RefreshCw className={`w-4 h-4 mr-1.5 ${isFetching ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  onClick={() => setAddDialogOpen(true)}
                  className="bg-rose-dark hover:bg-rose-dark/90 text-ivory font-sans shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Product
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Bar — only shown on Products tab */}
      {activeTab === 'products' && !isLoading && !isError && products && (
        <section className="border-b border-blush-deep/10 bg-white/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs text-foreground/50 uppercase tracking-wider">
                  Total Products
                </span>
                <span className="font-serif text-lg font-semibold text-rose-dark">
                  {products.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs text-foreground/50 uppercase tracking-wider">
                  Featured
                </span>
                <span className="font-serif text-lg font-semibold text-gold">
                  {products.filter((p) => p.featured).length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs text-foreground/50 uppercase tracking-wider">
                  Out of Stock
                </span>
                <span className="font-serif text-lg font-semibold text-destructive">
                  {products.filter((p) => Number(p.stock) === 0).length}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-blush/40 border border-blush-deep/20 p-1 rounded-xl h-auto flex-wrap gap-1">
            <TabsTrigger
              value="products"
              className="font-sans text-sm data-[state=active]:bg-white data-[state=active]:text-rose-dark data-[state=active]:shadow-sm rounded-lg px-5 py-2 flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="font-sans text-sm data-[state=active]:bg-white data-[state=active]:text-rose-dark data-[state=active]:shadow-sm rounded-lg px-5 py-2 flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              Site Settings
            </TabsTrigger>
            <TabsTrigger
              value="shopify"
              className="font-sans text-sm data-[state=active]:bg-white data-[state=active]:text-rose-dark data-[state=active]:shadow-sm rounded-lg px-5 py-2 flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Shopify Import
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl bg-blush/30" />
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <Settings2 className="w-8 h-8 text-destructive/50" />
                </div>
                <p className="font-serif text-xl text-foreground/60 mb-2">Failed to load products</p>
                <p className="font-sans text-sm text-foreground/40 mb-6">
                  There was an error fetching the product list.
                </p>
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  className="border-blush-deep/40 hover:bg-blush/50"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <ProductTable products={products ?? []} />
            )}
          </TabsContent>

          {/* Site Settings Tab */}
          <TabsContent value="settings">
            <SiteSettingsSection />
          </TabsContent>

          {/* Shopify Import Tab */}
          <TabsContent value="shopify">
            <ShopifyImportPanel
              siteSettings={siteSettings}
              onGoToSettings={() => setActiveTab('settings')}
            />
          </TabsContent>
        </Tabs>
      </section>

      {/* Add Product Dialog */}
      <ProductFormDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mode="add"
      />
    </main>
  );
}
