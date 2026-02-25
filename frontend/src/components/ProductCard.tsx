import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ShoppingBag, Eye } from 'lucide-react';
import { useAddToCart } from '../hooks/useQueries';
import { getProductImage } from '../utils/imageHelpers';
import type { Product } from '../backend';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAddToCart();
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0n) return;
    try {
      await addToCart.mutateAsync({ productId: product.id, quantity: 1n });
      toast.success(`${product.name} added to cart!`, {
        description: 'View your cart to checkout.',
      });
    } catch {
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  const imageUrl = imgError ? getProductImage('') : getProductImage(product.imageUrl);
  const price = (Number(product.price) / 100).toFixed(2);
  const outOfStock = product.stock === 0n;

  return (
    <article className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-blush-deep/20">
      {/* Image */}
      <Link
        to="/product/$id"
        params={{ id: product.id.toString() }}
        className="block relative overflow-hidden aspect-square bg-blush/30"
      >
        <img
          src={imageUrl}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {outOfStock && (
          <div className="absolute inset-0 bg-rose-dark/40 flex items-center justify-center">
            <span className="bg-ivory text-rose-dark text-xs font-semibold px-3 py-1 rounded-full font-sans tracking-wider uppercase">
              Sold Out
            </span>
          </div>
        )}
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-rose-dark/0 group-hover:bg-rose-dark/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="flex items-center gap-1.5 bg-ivory/90 text-rose-dark text-xs font-semibold px-4 py-2 rounded-full font-sans tracking-wider uppercase shadow-sm">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs font-sans font-medium tracking-widest uppercase text-gold mb-1">
            {product.category}
          </p>
          <Link to="/product/$id" params={{ id: product.id.toString() }}>
            <h3 className="font-serif text-base font-semibold text-foreground leading-snug hover:text-rose-dark transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-serif text-lg font-semibold text-rose-dark">
            ${price}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock || addToCart.isPending}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-200 ${
              outOfStock
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-rose-dark text-ivory hover:bg-gold hover:text-rose-dark shadow-sm hover:shadow-md'
            }`}
          >
            {addToCart.isPending ? (
              <span className="w-3.5 h-3.5 border-2 border-ivory/40 border-t-ivory rounded-full animate-spin" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5" />
            )}
            {outOfStock ? 'Sold Out' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  );
}
