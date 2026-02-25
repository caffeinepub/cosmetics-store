import { useState, useMemo } from 'react';
import { useGetProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { SlidersHorizontal, X } from 'lucide-react';

export default function ShopPage() {
  const { data: products, isLoading, error } = useGetProducts();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => {
    if (!products) return [];
    return Array.from(new Set(products.map((p) => p.category))).sort();
  }, [products]);

  const maxPrice = useMemo(() => {
    if (!products || products.length === 0) return 500;
    return Math.ceil(Math.max(...products.map((p) => Number(p.price) / 100)));
  }, [products]);

  // Initialize price range when products load
  useMemo(() => {
    if (maxPrice > 0) {
      setPriceRange([0, maxPrice]);
    }
  }, [maxPrice]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const price = Number(p.price) / 100;
      const matchesCategory = selectedCategory === '' || p.category === selectedCategory;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      return matchesCategory && matchesPrice;
    });
  }, [products, selectedCategory, priceRange]);

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Page Header */}
      <div className="bg-blush/30 border-b border-blush-deep/20 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">Our Collection</p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Shop All Products
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <p className="font-sans text-sm text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-blush-deep/40 rounded-full text-sm font-sans font-medium text-foreground hover:bg-blush transition-colors"
          >
            {showFilters ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
            {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`w-56 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="sticky top-24">
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                priceRange={priceRange}
                maxPrice={maxPrice}
                onPriceRangeChange={setPriceRange}
              />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Results count (desktop) */}
            <div className="hidden md:flex items-center justify-between mb-6">
              <p className="font-sans text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
                {selectedCategory && (
                  <span> in <span className="font-semibold text-rose-dark">{selectedCategory}</span></span>
                )}
              </p>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="text-center py-20 space-y-3">
                <p className="font-serif text-xl text-muted-foreground">Unable to load products.</p>
                <p className="font-sans text-sm text-muted-foreground">Please refresh the page and try again.</p>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-20 space-y-4">
                <p className="font-serif text-2xl text-muted-foreground">No products found</p>
                <p className="font-sans text-sm text-muted-foreground">
                  Try adjusting your filters or{' '}
                  <button
                    onClick={() => { setSelectedCategory(''); setPriceRange([0, maxPrice]); }}
                    className="text-rose-dark underline underline-offset-2 hover:text-gold transition-colors"
                  >
                    clear all filters
                  </button>
                </p>
              </div>
            )}

            {/* Grid */}
            {!isLoading && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id.toString()} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
