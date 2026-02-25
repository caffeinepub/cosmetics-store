import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useGetFeaturedProducts } from '../hooks/useQueries';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedProducts() {
  const { data: products, isLoading, error } = useGetFeaturedProducts();

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">Curated For You</p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Featured Collection
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
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
          <div className="text-center py-12 text-muted-foreground font-sans">
            <p>Unable to load featured products. Please try again.</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && (!products || products.length === 0) && (
          <div className="text-center py-16 space-y-4">
            <p className="font-serif text-xl text-muted-foreground">No featured products yet.</p>
            <p className="font-sans text-sm text-muted-foreground">Check back soon for our curated picks.</p>
          </div>
        )}

        {/* Products Grid */}
        {products && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-rose-dark text-rose-dark font-sans font-semibold text-sm tracking-widest uppercase rounded-full hover:bg-rose-dark hover:text-ivory transition-all duration-300 group"
              >
                View All Products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
