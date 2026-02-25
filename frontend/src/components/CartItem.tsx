import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import { useRemoveFromCart, useUpdateCartItem } from '../hooks/useQueries';
import { getProductImage } from '../utils/imageHelpers';
import QuantitySelector from './QuantitySelector';
import type { Product } from '../backend';
import { toast } from 'sonner';

interface CartItemProps {
  productId: bigint;
  quantity: bigint;
  product: Product | null;
}

export default function CartItem({ productId, quantity, product }: CartItemProps) {
  const removeFromCart = useRemoveFromCart();
  const updateCartItem = useUpdateCartItem();
  const [localQty, setLocalQty] = useState(Number(quantity));
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setLocalQty(Number(quantity));
  }, [quantity]);

  const handleQuantityChange = async (newQty: number) => {
    setLocalQty(newQty);
    try {
      await updateCartItem.mutateAsync({ productId, quantity: BigInt(newQty) });
    } catch {
      setLocalQty(Number(quantity));
      toast.error('Failed to update quantity.');
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart.mutateAsync(productId);
      toast.success('Item removed from cart.');
    } catch {
      toast.error('Failed to remove item.');
    }
  };

  if (!product) {
    return (
      <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-blush-deep/20 animate-pulse">
        <div className="w-20 h-20 bg-blush rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-blush rounded w-3/4" />
          <div className="h-3 bg-blush rounded w-1/2" />
        </div>
      </div>
    );
  }

  const imageUrl = imgError ? getProductImage('') : getProductImage(product.imageUrl);
  const unitPrice = Number(product.price) / 100;
  const lineTotal = (unitPrice * localQty).toFixed(2);

  return (
    <div className="flex items-start gap-4 p-4 bg-card rounded-2xl border border-blush-deep/20 shadow-xs hover:shadow-card transition-shadow duration-200">
      {/* Image */}
      <Link to="/product/$id" params={{ id: product.id.toString() }} className="flex-shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-20 h-20 object-cover rounded-xl bg-blush/30"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 space-y-2">
        <div>
          <p className="text-xs font-sans font-medium tracking-widest uppercase text-gold">{product.category}</p>
          <Link to="/product/$id" params={{ id: product.id.toString() }}>
            <h4 className="font-serif text-base font-semibold text-foreground hover:text-rose-dark transition-colors line-clamp-1">
              {product.name}
            </h4>
          </Link>
          <p className="text-sm font-sans text-muted-foreground">${unitPrice.toFixed(2)} each</p>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <QuantitySelector
            value={localQty}
            min={1}
            max={Number(product.stock)}
            onChange={handleQuantityChange}
            disabled={updateCartItem.isPending}
          />
          <div className="flex items-center gap-4">
            <span className="font-serif text-lg font-semibold text-rose-dark">${lineTotal}</span>
            <button
              onClick={handleRemove}
              disabled={removeFromCart.isPending}
              className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
              aria-label="Remove item"
            >
              {removeFromCart.isPending ? (
                <span className="w-4 h-4 border-2 border-muted-foreground/40 border-t-muted-foreground rounded-full animate-spin block" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
