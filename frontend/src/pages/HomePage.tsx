import HeroBanner from '../components/HeroBanner';
import PromoBanner from '../components/PromoBanner';
import FeaturedProducts from '../components/FeaturedProducts';
import { Link } from '@tanstack/react-router';
import { Sparkles, Leaf, Award } from 'lucide-react';
import { useGetSiteSettings } from '../hooks/useQueries';

const features = [
  {
    icon: Sparkles,
    title: 'Premium Quality',
    desc: 'Every product is carefully selected for its exceptional quality and performance.',
  },
  {
    icon: Leaf,
    title: 'Clean Beauty',
    desc: 'Cruelty-free, vegan formulas made with sustainably sourced ingredients.',
  },
  {
    icon: Award,
    title: 'Expert Curated',
    desc: 'Our beauty experts handpick each product to ensure it meets our high standards.',
  },
];

export default function HomePage() {
  const { data: siteSettings } = useGetSiteSettings();

  return (
    <div className="animate-fade-in">
      <HeroBanner heroImageUrl={siteSettings?.heroBannerImageUrl} />
      <PromoBanner
        promoBannerText={siteSettings?.promoBannerText}
        promoBannerEnabled={siteSettings?.promoBannerEnabled}
      />
      <FeaturedProducts />

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-blush/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">Why Choose Us</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
              The Glow Difference
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="text-center p-8 bg-card rounded-2xl shadow-card border border-blush-deep/20 hover:shadow-card-hover transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-blush flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-rose-dark" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{title}</h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-rose-dark text-ivory text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-4">Limited Time</p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-6 leading-tight">
            Discover Your Perfect<br />
            <em className="text-gold-light not-italic">Beauty Ritual</em>
          </h2>
          <p className="font-sans text-base text-ivory/70 mb-8 leading-relaxed">
            Explore our full collection of luxury cosmetics and find the products that speak to your unique beauty.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-10 py-4 bg-gold text-rose-dark font-sans font-semibold text-sm tracking-widest uppercase rounded-full hover:bg-gold-light transition-all duration-300 shadow-glow"
          >
            Explore Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
