'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { SuggestionsSkeleton } from '@/components/analysis-skeleton';
import { SuggestionsGrid } from './suggestions-grid';
import type { Suggestion } from '@/actions/suggestions';
import type { AdvancedAnalytics } from '@/actions/analyze';

interface SuggestionsSectionProps {
  isGettingSuggestions: boolean;
  showSuggestions: boolean;
  suggestions: Suggestion[] | null;
  suggestionsRef: React.RefObject<HTMLDivElement | null>;
  handleReanalyze: (text: string) => void;
  handleSimulateABTest: (suggestion: {
    text: string;
    analytics: AdvancedAnalytics;
    scores: {
      engagement: number;
      friendliness: number;
      virality: number;
    };
  }) => void;
  isAnalyzing: boolean;
  currentAnalyzing: string | null;
}

export function SuggestionsSection({
  isGettingSuggestions,
  showSuggestions,
  suggestions,
  suggestionsRef,
  handleReanalyze,
  handleSimulateABTest,
  isAnalyzing,
  currentAnalyzing,
}: SuggestionsSectionProps) {
  return (
    <AnimatePresence mode="wait">
      {isGettingSuggestions && (
        <motion.div
          key="suggestions-skeleton"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-6xl space-y-4"
        >
          <h2 className="text-2xl font-bold">Suggestions</h2>
          <SuggestionsSkeleton />
        </motion.div>
      )}

      <div
        ref={suggestionsRef}
        key="suggestions"
        className="relative mx-auto mt-8 max-w-6xl space-y-8"
      >
        {showSuggestions && suggestions && (
          <motion.div
            key="suggestions-grid-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold">Suggestions</h2>
            <SuggestionsGrid
              suggestions={suggestions}
              onReanalyze={handleReanalyze}
              onSimulateABTest={handleSimulateABTest}
              isAnalyzing={isAnalyzing}
              currentAnalyzing={currentAnalyzing}
            />
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
