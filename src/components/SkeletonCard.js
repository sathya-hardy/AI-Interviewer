function SkeletonCard({ index = 0 }) {
  return (
    <div
      className="card-glass p-0 overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex">
        <div className="w-1 shrink-0 bg-white/[0.06]" />
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 space-y-2.5">
              <div
                className="h-5 w-12 rounded-md shimmer-bg animate-shimmer"
                style={{ animationDelay: `${index * 100}ms` }}
              />
              <div
                className="h-3.5 w-full rounded-md shimmer-bg animate-shimmer"
                style={{ animationDelay: `${index * 100 + 50}ms` }}
              />
              <div
                className="h-3.5 w-3/4 rounded-md shimmer-bg animate-shimmer"
                style={{ animationDelay: `${index * 100 + 100}ms` }}
              />
            </div>
          </div>
          <div
            className="h-6 w-20 rounded-full shimmer-bg animate-shimmer"
            style={{ animationDelay: `${index * 100 + 150}ms` }}
          />
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
