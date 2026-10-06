export function ProductCardSkeleton() {
  return (
    <div className="bg-cream-100/70 rounded-2xl overflow-hidden border border-teak-200/40 shadow-warm-sm animate-pulse">
      <div className="aspect-[4/3] bg-teak-200/50 w-full" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-teak-200/60 rounded w-1/4" />
        <div className="h-6 bg-teak-300/60 rounded w-3/4" />
        <div className="h-4 bg-teak-200/40 rounded w-full" />
        <div className="pt-2 flex justify-between items-center border-t border-teak-200/40">
          <div className="h-5 bg-teak-300/60 rounded w-1/3" />
          <div className="h-9 bg-teak-400/50 rounded-lg w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-[4/3] bg-teak-200/50 rounded-2xl w-full" />
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-teak-200/60 rounded-xl" />
            <div className="w-20 h-20 bg-teak-200/60 rounded-xl" />
            <div className="w-20 h-20 bg-teak-200/60 rounded-xl" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-4 bg-teak-200/60 rounded w-1/4" />
          <div className="h-10 bg-teak-300/60 rounded w-3/4" />
          <div className="h-6 bg-teak-400/50 rounded w-1/3" />
          <div className="space-y-2">
            <div className="h-4 bg-teak-200/50 rounded w-full" />
            <div className="h-4 bg-teak-200/50 rounded w-5/6" />
          </div>
          <div className="h-28 bg-cream-200/60 rounded-xl" />
          <div className="h-14 bg-teak-800/40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
