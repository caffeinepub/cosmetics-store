import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { ShoppingBag, ArrowLeft, Package, Tag } from 'lucide-react';
import { useGetProductById, useAddToCart } from '../hooks/useQueries';
import { getProductImage } from '../utils/imageHelpers';
import QuantitySelector from '../components/QuantitySelector';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { id } = useParams({ from: '/product/$id' });
  const productId = BigInt(id);
  const { data: product, isLoading, error } = useGetProductById(productId);
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = async () => {
    if (!product || product.stock === 0n) return;
    try {
      await addToCart.mutateAsync({ productId: product.id, quantity: BigInt(quantity) });
      toast.success(`${product.name} added to cart!`, {
        description: `${quantity} item${quantity > 1 ? 's' : ''} added.`,
      });
    } catch {
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <p className="font-serif text-2xl text-muted-foreground">Product not found</p>
        <Link to="/shop" className="inline-flex items-center gap-2 text-rose-dark hover:text-gold transition-colors font-sans text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  const imageUrl = imgError ? getProductImage('') : getProductImage(product.imageUrl);
  const price = (Number(product.price) / 100).toFixed(2);
  const outOfStock = product.stock === 0n;
  const stockCount = Number(product.stock);

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-blush/20 border-b border-blush-deep/20 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-sans text-muted-foreground">
            <Link to="/" className="hover:text-rose-dark transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-rose-dark transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-blush/30 shadow-card">
              <img
                src={imageUrl}
                alt={product.name}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            </div>
            {outOfStock && (
              <div className="absolute top-4 left-4 bg-rose-dark text-ivory text-xs font-semibold px-3 py-1.5 rounded-full font-sans tracking-wider uppercase">
                Sold Out
              </div>
            )}
            {product.featured && !outOfStock && (
              <div className="absolute top-4 left-4 bg-gold text-rose-dark text-xs font-semibold px-3 py-1.5 rounded-full font-sans tracking-wider uppercase">
                Featured
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6 flex flex-col justify-center">
            {/* Category & Name */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-3.5 h-3.5 text-gold" />
                <span className="font-sans text-xs font-semibold tracking-widest uppercase text-gold">
                  {product.category}
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground leading-tight mb-3">
                {product.name}
              </h1>
              <p className="font-serif text-3xl font-semibold text-rose-dark">${price}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-blush-deep/30" />

            {/* Description */}
            <div>
              <h3 className="font-sans text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                Description
              </h3>
              <p className="font-sans text-base text-foreground/80 leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              {outOfStock ? (
                <span className="font-sans text-sm font-medium text-destructive">Out of stock</span>
              ) : stockCount <= 5 ? (
                <span className="font-sans text-sm font-medium text-amber-600">
                  Only {stockCount} left in stock
                </span>
              ) : (
                <span className="font-sans text-sm font-medium text-green-700">In stock</span>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            {!outOfStock && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-sans text-sm font-medium text-muted-foreground">Quantity</span>
                  <QuantitySelector
                    value={quantity}
                    min={1}
                    max={stockCount}
                    onChange={setQuantity}
                  />
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-rose-dark text-ivory font-sans font-semibold text-sm tracking-widest uppercase rounded-full hover:bg-gold hover:text-rose-dark transition-all duration-300 shadow-card hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {addToCart.isPending ? (
                    <span className="w-5 h-5 border-2 border-ivory/40 border-t-ivory rounded-full animate-spin" />
                  ) : (
                    <ShoppingBag className="w-5 h-5" />
                  )}
                  {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            )}

            {outOfStock && (
              <button
                disabled
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-muted text-muted-foreground font-sans font-semibold text-sm tracking-widest uppercase rounded-full cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                Out of Stock
              </button>
            )}

            {/* Back link */}
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-rose-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
