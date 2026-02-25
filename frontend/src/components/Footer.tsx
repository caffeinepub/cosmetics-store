import { Link } from '@tanstack/react-router';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'glow-shop');

  return (
    <footer className="bg-rose-dark text-ivory/90 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-gold" />
              </div>
              <span className="font-serif text-xl font-semibold text-ivory">Glow Shop</span>
            </div>
            <p className="text-sm text-ivory/60 leading-relaxed font-sans">
              Luxury cosmetics curated for the modern woman. Discover beauty that inspires confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-gold tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-sm font-sans">
              <li><Link to="/" className="text-ivory/70 hover:text-gold transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-ivory/70 hover:text-gold transition-colors">Shop All</Link></li>
              <li><Link to="/cart" className="text-ivory/70 hover:text-gold transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-gold tracking-wide">Our Promise</h4>
            <ul className="space-y-2 text-sm text-ivory/70 font-sans">
              <li>✦ Cruelty-free formulas</li>
              <li>✦ Premium ingredients</li>
              <li>✦ Sustainable packaging</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-ivory/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ivory/50 font-sans">
          <span>© {year} Glow Shop. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-blush-deep fill-blush-deep mx-0.5" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
