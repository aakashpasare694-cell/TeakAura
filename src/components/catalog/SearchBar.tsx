import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search by name, wood type, or style...' }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-white border border-teak-200/80 rounded-xl text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all shadow-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
