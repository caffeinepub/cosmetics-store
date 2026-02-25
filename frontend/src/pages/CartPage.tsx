import { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import { useGetCart, useGetProducts } from '../hooks/useQueries';
import CartItem from '../components/CartItem';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '../types';

export default function CartPage() {
  const { data: cart, isLoading: cartLoading } = useGetCart();
  const { data: products, isLoading: productsLoading } = useGetProducts();

  const isLoading = cartLoading || productsLoading;

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    if (products) {
      products.forEach((p) => map.set(p.id.toString(), p));
    }
    return map;
  }, [products]);

  const subtotal = useMemo(() => {
    if (!cart || !products) return 0;
    return cart.items.reduce((sum, item) => {
      const product = productMap.get(item.productId.toString());
      if (!product) return sum;
      return sum + (Number(product.price) / 100) * Number(item.quantity);
    }, 0);
  }, [cart, products, productMap]);

  const itemCount = cart?.items.reduce((sum, item) => sum + Number(item.quantity), 0) ?? 0;

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <div className="bg-blush/30 border-b border-blush-deep/20 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">Your Selection</p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Shopping Cart
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Loading */}
        {isLoading && (
          <div className="space-y-4 max-w-2xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4 bg-card rounded-2xl border border-blush-deep/20">
                <Skeleton className="w-20 h-20 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Cart */}
        {!isLoading && (!cart || cart.items.length === 0) && (
          <div className="text-center py-24 space-y-6">
            <div className="w-20 h-20 rounded-full bg-blush flex items-center justify-center mx-auto">
              <ShoppingCart className="w-9 h-9 text-rose-dark" />
            </div>
            <div>
              <p className="font-serif text-2xl font-semibold text-foreground mb-2">Your cart is empty</p>
              <p className="font-sans text-sm text-muted-foreground">
                Discover our luxurious collection and add your favorites.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-rose-dark text-ivory font-sans font-semibold text-sm tracking-widest uppercase rounded-full hover:bg-gold hover:text-rose-dark transition-all duration-300 shadow-card"
            >
              <ShoppingBag className="w-4 h-4" /> Shop Now
            </Link>
          </div>
        )}

        {/* Cart Items + Summary */}
        {!isLoading && cart && cart.items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  {itemCount} Item{itemCount !== 1 ? 's' : ''}
                </h2>
                <Link to="/shop" className="text-sm font-sans text-muted-foreground hover:text-rose-dark transition-colors">
                  Continue Shopping
                </Link>
              </div>
              {cart.items.map((item) => (
                <CartItem
                  key={item.productId.toString()}
                  productId={item.productId}
                  quantity={item.quantity}
                  product={productMap.get(item.productId.toString()) ?? null}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl border border-blush-deep/20 shadow-card p-6 space-y-5">
                <h2 className="font-serif text-xl font-semibold text-foreground">Order Summary</h2>
                <div className="space-y-3 text-sm font-sans">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                    <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-green-700 font-medium">
                      {subtotal >= 50 ? 'Free' : '$5.99'}
                    </span>
                  </div>
                  {subtotal < 50 && (
                    <p className="text-xs text-gold bg-gold/10 rounded-lg px-3 py-2">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  )}
                </div>
                <div className="border-t border-blush-deep/20 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-base font-semibold text-foreground">Total</span>
                    <span className="font-serif text-xl font-semibold text-rose-dark">
                      ${(subtotal + (subtotal >= 50 ? 0 : 5.99)).toFixed(2)}
                    </span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-rose-dark text-ivory font-sans font-semibold text-sm tracking-widest uppercase rounded-full hover:bg-gold hover:text-rose-dark transition-all duration-300 shadow-card hover:shadow-glow"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-xs text-center font-sans text-muted-foreground">
                  Secure checkout · Free returns
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
