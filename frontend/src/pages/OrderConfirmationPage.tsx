import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { CheckCircle2, ShoppingBag, Sparkles } from 'lucide-react';

const ORDER_ID_KEY = 'glow_shop_last_order_id';

export default function OrderConfirmationPage() {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(ORDER_ID_KEY);
    if (stored !== null) {
      setOrderId(stored);
      // Clean up so refreshing doesn't re-show stale order
      sessionStorage.removeItem(ORDER_ID_KEY);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 animate-fade-in">
      <div className="max-w-lg w-full text-center space-y-8 py-16">
        {/* Success Icon */}
        <div className="relative inline-flex">
          <div className="w-24 h-24 rounded-full bg-blush flex items-center justify-center mx-auto shadow-card">
            <CheckCircle2 className="w-12 h-12 text-rose-dark" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gold flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-ivory" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold">Order Confirmed</p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
            Thank You for Your Order!
          </h1>
          <p className="font-sans text-base text-muted-foreground leading-relaxed">
            Your order has been placed successfully. We're preparing your luxurious cosmetics with care.
          </p>
        </div>

        {/* Order ID */}
        {orderId !== null && (
          <div className="bg-blush/40 border border-blush-deep/30 rounded-2xl px-6 py-5 space-y-1">
            <p className="font-sans text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Order Reference
            </p>
            <p className="font-serif text-2xl font-semibold text-rose-dark">
              #{orderId.padStart(6, '0')}
            </p>
          </div>
        )}

        {/* Details */}
        <div className="bg-card border border-blush-deep/20 rounded-2xl p-6 text-left space-y-3 shadow-xs">
          <h3 className="font-serif text-base font-semibold text-foreground">What's Next?</h3>
          <ul className="space-y-2 font-sans text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-gold mt-0.5">✦</span>
              Your order is being carefully prepared and packaged.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-0.5">✦</span>
              You'll receive your luxurious cosmetics in beautiful packaging.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold mt-0.5">✦</span>
              Enjoy your new beauty ritual!
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-rose-dark text-ivory font-sans font-semibold text-sm tracking-widest uppercase rounded-full hover:bg-gold hover:text-rose-dark transition-all duration-300 shadow-card"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-rose-dark text-rose-dark font-sans font-semibold text-sm tracking-widest uppercase rounded-full hover:bg-rose-dark hover:text-ivory transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
