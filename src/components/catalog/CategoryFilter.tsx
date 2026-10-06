import { motion } from 'framer-motion';
import { Category } from '../../types';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const allTabs = [
    { id: 0, name: 'All Pieces', slug: 'all' },
    ...categories,
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none py-1">
      {allTabs.map((tab) => {
        const isActive = activeCategory === tab.slug;
        return (
          <button
            key={tab.slug}
            onClick={() => onSelectCategory(tab.slug)}
            className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              isActive
                ? 'text-cream-50 font-semibold'
                : 'text-stone-700 bg-white hover:bg-cream-200/60 border border-teak-200/60'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeCategoryPill"
                className="absolute inset-0 bg-teak-900 rounded-full shadow-warm-sm"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
}
