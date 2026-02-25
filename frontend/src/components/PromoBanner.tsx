import { getPromoBanner } from '../utils/imageHelpers';

const defaultPromoItems = [
  '✦ Free shipping on orders over $50',
  '✦ New arrivals every week',
  '✦ Cruelty-free & vegan formulas',
  '✦ Luxury packaging included',
  '✦ 30-day satisfaction guarantee',
  '✦ Exclusive member rewards',
];

interface PromoBannerProps {
  promoBannerText?: string;
  promoBannerEnabled?: boolean;
}

export default function PromoBanner({ promoBannerText, promoBannerEnabled = true }: PromoBannerProps) {
  // If explicitly disabled, render nothing
  if (promoBannerEnabled === false) return null;

  // If a custom text is provided, use it as a single scrolling item (doubled for seamless loop)
  // Otherwise fall back to the default static items
  const items =
    promoBannerText && promoBannerText.trim() !== ''
      ? [promoBannerText.trim()]
      : defaultPromoItems;

  const doubled = [...items, ...items];

  return (
    <div
      className="relative w-full overflow-hidden py-4"
      style={{
        backgroundImage: `url(${getPromoBanner()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-rose-dark/75" />

      <div className="relative z-10 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {doubled.map((item, i) => (
            <span
              key={i}
              className="inline-block px-8 font-sans text-sm font-medium tracking-widest text-gold uppercase"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
