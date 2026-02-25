import { Link, useLocation } from '@tanstack/react-router';
import { ShoppingBag, Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useGetCart } from '../hooks/useQueries';
import { Badge } from '@/components/ui/badge';

export default function Navigation() {
  const location = useLocation();
  const { data: cart } = useGetCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = cart?.items.reduce((sum, item) => sum + Number(item.quantity), 0) ?? 0;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-sm border-b border-blush-deep/30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blush-deep to-gold flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-ivory" />
            </div>
            <span className="font-serif text-xl md:text-2xl font-semibold text-rose-dark tracking-wide">
              Glow Shop
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-sans text-sm font-medium tracking-widest uppercase transition-colors duration-200 ${
                  isActive(link.to)
                    ? 'text-rose-dark border-b-2 border-gold pb-0.5'
                    : 'text-foreground/70 hover:text-rose-dark'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-full bg-blush hover:bg-blush-deep/30 transition-colors duration-200 group"
            >
              <ShoppingBag className="w-5 h-5 text-rose-dark" />
              <span className="hidden sm:inline text-sm font-medium text-rose-dark font-sans">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gold text-ivory text-xs font-bold flex items-center justify-center shadow-sm">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-blush transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5 text-rose-dark" /> : <Menu className="w-5 h-5 text-rose-dark" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-blush-deep/20 py-4 space-y-1 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium tracking-widest uppercase transition-colors ${
                  isActive(link.to)
                    ? 'bg-blush text-rose-dark'
                    : 'text-foreground/70 hover:bg-blush/50 hover:text-rose-dark'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
