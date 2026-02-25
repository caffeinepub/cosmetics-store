import { useMemo } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ShieldCheck, Package } from 'lucide-react';
import { useGetCart, useGetProducts, usePlaceOrder, useClearCart } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { getProductImage } from '../utils/imageHelpers';
import type { Product } from '../backend';
import { toast } from 'sonner';

const ORDER_ID_KEY = 'glow_shop_last_order_id';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading: cartLoading } = useGetCart();
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const placeOrder = usePlaceOrder();
  const clearCart = useClearCart();

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

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;
  const itemCount = cart?.items.reduce((sum, item) => sum + Number(item.quantity), 0) ?? 0;

  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) return;
    try {
      const orderId = await placeOrder.mutateAsync();
      await clearCart.mutateAsync();
      // Store order ID in sessionStorage to pass to confirmation page
      sessionStorage.setItem(ORDER_ID_KEY, orderId.toString());
      navigate({ to: '/order-confirmation' });
    } catch {
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (!isLoading && (!cart || cart.items.length === 0)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <Package className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="font-serif text-xl text-muted-foreground">Your cart is empty</p>
          <Link to="/shop" className="inline-flex items-center gap-2 text-rose-dark hover:text-gold transition-colors font-sans text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <div className="bg-blush/30 border-b border-blush-deep/20 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">Almost There</p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-3">Checkout</h1>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-rose-dark transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-semibold text-foreground">Order Summary</h2>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-card rounded-xl border border-blush-deep/20">
                    <Skeleton className="w-14 h-14 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {cart?.items.map((item) => {
                  const product = productMap.get(item.productId.toString());
                  if (!product) return null;
                  const lineTotal = ((Number(product.price) / 100) * Number(item.quantity)).toFixed(2);
                  return (
                    <div
                      key={item.productId.toString()}
                      className="flex items-center gap-3 p-3 bg-card rounded-xl border border-blush-deep/20"
                    >
                      <img
                        src={getProductImage(product.imageUrl)}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-lg bg-blush/30 flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = getProductImage(''); }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-sm font-semibold text-foreground line-clamp-1">{product.name}</p>
                        <p className="font-sans text-xs text-muted-foreground">Qty: {Number(item.quantity)}</p>
                      </div>
                      <span className="font-serif text-sm font-semibold text-rose-dark flex-shrink-0">${lineTotal}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div>
            <div className="bg-card rounded-2xl border border-blush-deep/20 shadow-card p-6 space-y-5 sticky top-24">
              <h2 className="font-serif text-xl font-semibold text-foreground">Price Details</h2>

              <div className="space-y-3 text-sm font-sans">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                  <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-700 font-medium' : 'font-medium text-foreground'}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-blush-deep/20 pt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-serif text-base font-semibold text-foreground">Total</span>
                  <span className="font-serif text-2xl font-semibold text-rose-dark">${total.toFixed(2)}</span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placeOrder.isPending || clearCart.isPending || isLoading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-rose-dark text-ivory font-sans font-semibold text-sm tracking-widest uppercase rounded-full hover:bg-gold hover:text-rose-dark transition-all duration-300 shadow-card hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {placeOrder.isPending || clearCart.isPending ? (
                    <>
                      <span className="w-5 h-5 border-2 border-ivory/40 border-t-ivory rounded-full animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      Place Order
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-sans text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                <span>Secure & encrypted checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
