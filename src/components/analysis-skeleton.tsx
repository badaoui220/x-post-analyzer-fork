import { Skeleton } from '@/components/ui/skeleton';

export function AnalysisSkeleton() {
  return (
    <div className="relative mx-auto w-full max-w-lg space-y-6 overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] p-6">
      {/* Content */}
      <div className="relative z-10">
        {/* Global Score */}
        <div className="mb-8 flex flex-col items-center justify-center">
          <Skeleton className="bg-accent/10 mb-2 h-16 w-24" /> {/* For the percentage */}
          <Skeleton className="bg-accent/10 h-4 w-16" /> {/* For "Global Score" text */}
          <Skeleton className="bg-accent/10 mt-4 h-4 w-full" /> {/* For the post content */}
        </div>

        {/* Score Bars */}
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex justify-between">
              <Skeleton className="bg-accent/10 h-4 w-20" /> {/* "Engagement" label */}
              <Skeleton className="bg-accent/10 h-4 w-12" /> {/* Percentage */}
            </div>
            <Skeleton className="h-1.5 w-full bg-[#2a2a2a]" />
          </div>

          <div>
            <div className="mb-2 flex justify-between">
              <Skeleton className="bg-accent/10 h-4 w-20" /> {/* "Friendliness" label */}
              <Skeleton className="bg-accent/10 h-4 w-12" /> {/* Percentage */}
            </div>
            <Skeleton className="h-1.5 w-full bg-[#2a2a2a]" />
          </div>

          <div>
            <div className="mb-2 flex justify-between">
              <Skeleton className="bg-accent/10 h-4 w-20" /> {/* "Virality" label */}
              <Skeleton className="bg-accent/10 h-4 w-12" /> {/* Percentage */}
            </div>
            <Skeleton className="h-1.5 w-full bg-[#2a2a2a]" />
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#2a2a2a] pt-6">
          {/* Readability */}
          <div className="flex items-start gap-3">
            <Skeleton className="bg-accent/10 mt-1 h-5 w-5 rounded-full" /> {/* Icon */}
            <div>
              <Skeleton className="bg-accent/10 mb-1 h-4 w-32" /> {/* Title */}
              <Skeleton className="bg-accent/10 h-3 w-full" /> {/* Description line 1 */}
            </div>
          </div>

          {/* Sentiment */}
          <div className="flex items-start gap-3">
            <Skeleton className="bg-accent/10 mt-1 h-5 w-5 rounded-full" /> {/* Icon */}
            <div>
              <Skeleton className="bg-accent/10 mb-1 h-4 w-32" /> {/* Title */}
              <Skeleton className="bg-accent/10 h-3 w-full" /> {/* Description line 1 */}
              <Skeleton className="bg-accent/10 mt-1 h-3 w-3/4" /> {/* Description line 2 */}
            </div>
          </div>

          {/* Best Posting Time */}
          <div className="flex items-start gap-3">
            <Skeleton className="bg-accent/10 mt-1 h-5 w-5 rounded-full" /> {/* Icon */}
            <div>
              <Skeleton className="bg-accent/10 mb-1 h-4 w-32" /> {/* Title */}
              <Skeleton className="bg-accent/10 h-3 w-full" /> {/* Time */}
              <Skeleton className="bg-accent/10 mt-1 h-3 w-3/4" /> {/* Peak days */}
            </div>
          </div>

          {/* Hashtags */}
          <div className="flex items-start gap-3">
            <Skeleton className="bg-accent/10 mt-1 h-5 w-5 rounded-full" /> {/* Icon */}
            <div>
              <Skeleton className="bg-accent/10 mb-1 h-4 w-32" /> {/* Title */}
              <Skeleton className="bg-accent/10 h-3 w-full" /> {/* Hashtags */}
              <Skeleton className="bg-accent/10 mt-1 h-3 w-3/4" /> {/* Reach */}
            </div>
          </div>

          {/* Target Audience */}
          <div className="flex items-start gap-3">
            <Skeleton className="bg-accent/10 mt-1 h-5 w-5 rounded-full" /> {/* Icon */}
            <div>
              <Skeleton className="bg-accent/10 mb-1 h-4 w-32" /> {/* Title */}
              <Skeleton className="bg-accent/10 h-3 w-full" /> {/* Primary audience */}
              <Skeleton className="bg-accent/10 mt-1 h-3 w-3/4" /> {/* Interests */}
            </div>
          </div>

          {/* Keywords */}
          <div className="flex items-start gap-3">
            <Skeleton className="bg-accent/10 mt-1 h-5 w-5 rounded-full" /> {/* Icon */}
            <div>
              <Skeleton className="bg-accent/10 mb-1 h-4 w-32" /> {/* Title */}
              <Skeleton className="bg-accent/10 h-3 w-full" /> {/* Optimal keywords */}
              <Skeleton className="bg-accent/10 mt-1 h-3 w-3/4" /> {/* Trending keywords */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SuggestionsSkeleton() {
  return (
    <div className="relative mx-auto grid max-w-6xl grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4">
          <Skeleton className="bg-accent/10 h-96 w-full" />
        </div>
      ))}
    </div>
  );
}
