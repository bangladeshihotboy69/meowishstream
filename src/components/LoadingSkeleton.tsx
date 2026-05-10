export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="rounded-sm border border-white/[0.06] bg-[#0A0A0A] overflow-hidden animate-pulse">
          <div className="aspect-video bg-[#0F0F0F]" />
          <div className="p-4 space-y-3">
            <div className="h-3 w-3/4 rounded-sm bg-white/[0.06]" />
            <div className="h-2 w-1/2 rounded-sm bg-white/[0.04]" />
            <div className="h-9 w-full rounded-sm bg-white/[0.06]" />
          </div>
        </div>
      ))}
    </div>
  );
}
