import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  priceRange: [number, number];
  maxPrice: number;
  onPriceRangeChange: (range: [number, number]) => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  maxPrice,
  onPriceRangeChange,
}: ProductFiltersProps) {
  const hasFilters = selectedCategory !== '' || priceRange[0] > 0 || priceRange[1] < maxPrice;

  const clearFilters = () => {
    onCategoryChange('');
    onPriceRangeChange([0, maxPrice]);
  };

  return (
    <aside className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold text-foreground">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs font-sans text-muted-foreground hover:text-rose-dark transition-colors"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div className="space-y-3">
        <h4 className="font-sans text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Category
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange('')}
            className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium tracking-wide transition-all duration-200 border ${
              selectedCategory === ''
                ? 'bg-rose-dark text-ivory border-rose-dark'
                : 'bg-transparent text-foreground border-blush-deep/40 hover:border-rose-dark hover:text-rose-dark'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium tracking-wide transition-all duration-200 border ${
                selectedCategory === cat
                  ? 'bg-rose-dark text-ivory border-rose-dark'
                  : 'bg-transparent text-foreground border-blush-deep/40 hover:border-rose-dark hover:text-rose-dark'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="font-sans text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Price Range
        </h4>
        <div className="px-1">
          <Slider
            min={0}
            max={maxPrice}
            step={1}
            value={priceRange}
            onValueChange={(val) => onPriceRangeChange(val as [number, number])}
            className="w-full"
          />
        </div>
        <div className="flex items-center justify-between text-sm font-sans text-foreground">
          <span className="font-medium">${priceRange[0].toFixed(2)}</span>
          <span className="text-muted-foreground">—</span>
          <span className="font-medium">${priceRange[1].toFixed(2)}</span>
        </div>
      </div>
    </aside>
  );
}
