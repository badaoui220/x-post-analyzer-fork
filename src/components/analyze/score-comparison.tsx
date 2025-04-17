'use client';

import { cn } from '@/lib/utils';
import type { AnalysisResult } from '@/actions/analyze';

// Moved from analyze-form.tsx

interface ScoreComparisonProps {
  originalScores: AnalysisResult['scores'] | undefined | null;
  suggestionScores: AnalysisResult['scores'] | undefined | null;
}

export function ScoreComparison({ originalScores, suggestionScores }: ScoreComparisonProps) {
  if (!originalScores || !suggestionScores) return null;

  // Define metrics based on the actual expected scores
  const metrics = ['engagement', 'friendliness', 'virality'] as const;
  // If scores like clarity/polish are added back, add them here:
  // const metrics = ['engagement', 'clarity', 'virality', 'polish'] as const;

  const comparisons = metrics
    .map(metric => {
      // Check if metric exists on both score objects before comparing
      if (metric in originalScores && metric in suggestionScores) {
        const original = originalScores[metric as keyof typeof originalScores];
        const suggestion = suggestionScores[metric as keyof typeof suggestionScores];
        // Ensure scores are numbers before calculating diff
        if (typeof original === 'number' && typeof suggestion === 'number') {
          const diff = suggestion - original;
          return { label: metric.charAt(0).toUpperCase() + metric.slice(1), diff };
        }
      }
      return null; // Return null for metrics not present or invalid
    })
    .filter(Boolean); // Remove null entries

  if (comparisons.length === 0) return null; // Don't render if no valid comparisons

  return (
    <div className="mt-4 rounded-md border border-[#2a2a2a] bg-[#222] p-4">
      <h4 className="mb-3 text-center font-semibold text-white/80">
        Score Comparison (Suggestion vs Original)
      </h4>
      <div
        className={`grid gap-x-4 gap-y-2 grid-cols-${comparisons.length > 3 ? 4 : comparisons.length}`}
      >
        {' '}
        {/* Adjust grid cols */}
        {comparisons.map(
          comp =>
            comp && (
              <div key={comp.label} className="text-center">
                <div className="text-xs text-white/60">{comp.label}</div>
                <div
                  className={cn(
                    'text-lg font-bold',
                    comp.diff > 0
                      ? 'text-green-400'
                      : comp.diff < 0
                        ? 'text-red-400'
                        : 'text-white/80'
                  )}
                >
                  {comp.diff >= 0 ? `+${comp.diff}` : comp.diff}%
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}
