import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { getHeroImage } from '../utils/imageHelpers';

interface HeroBannerProps {
  heroImageUrl?: string;
}

export default function HeroBanner({ heroImageUrl }: HeroBannerProps) {
  const imageSrc =
    heroImageUrl && heroImageUrl.trim() !== '' ? heroImageUrl : getHeroImage();

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '420px' }}>
      {/* Background image */}
      <img
        src={imageSrc}
        alt="Luxury cosmetics collection"
        className="absolute inset-0 w-full h-full object-cover object-center"
        onError={(e) => {
          // Fall back to static asset if custom URL fails to load
          const target = e.currentTarget;
          if (target.src !== getHeroImage()) {
            target.src = getHeroImage();
          }
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-dark/80 via-rose-dark/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col items-start justify-center min-h-[420px]">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-4 animate-fade-in">
          New Collection 2026
        </p>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-ivory leading-tight max-w-xl mb-6 animate-fade-in">
          Radiance Begins<br />
          <em className="text-gold-light not-italic">With You</em>
        </h1>
        <p className="font-sans text-base text-ivory/80 max-w-md mb-8 leading-relaxed animate-fade-in">
          Discover our curated collection of luxury cosmetics — crafted to enhance your natural beauty with the finest ingredients.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-rose-dark font-sans font-semibold text-sm tracking-widest uppercase rounded-full hover:bg-gold-light transition-all duration-300 shadow-glow hover:shadow-lg group"
        >
          Shop Now
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
