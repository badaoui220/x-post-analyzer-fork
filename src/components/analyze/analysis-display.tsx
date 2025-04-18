'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import { PostPreviewSpot } from '../spots/post-preview-spot';
import { ScoresCard } from './scores-card';
import { StyleExamples } from './style-examples';
import type { AnalysisResult } from '@/actions/analyze';

interface AnalysisDisplayProps {
  analysis: AnalysisResult | null; // Assuming AnalysisResult is the correct type
  content: string;
  handleReturn: () => void;
  showSuggestions: boolean;
  handleGetSuggestions: () => void;
  isGettingSuggestions: boolean;
  apiKey: string;
}

export function AnalysisDisplay({
  analysis,
  content,
  handleReturn,
  showSuggestions,
  handleGetSuggestions,
  isGettingSuggestions,
  apiKey,
}: AnalysisDisplayProps) {
  if (!analysis) return null;

  return (
    <motion.div
      key="analysis"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <Button
          onClick={handleReturn}
          variant="ghost"
          size="sm"
          className="group text-white/60 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 cursor-pointer transition-transform group-hover:-translate-x-0.5" />
          Back
        </Button>
      </div>

      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-3">
          <PostPreviewSpot id="spot-analysis-top-1" content={content} scores={analysis.scores} />
          <PostPreviewSpot id="spot-analysis-top-2" content={content} scores={analysis.scores} />
          <PostPreviewSpot id="spot-analysis-top-3" content={content} scores={analysis.scores} />
        </div>

        <div className="relative grid items-start justify-center gap-6 md:grid-cols-2">
          <div className="relative">
            {!showSuggestions && (
              <Button
                onClick={handleGetSuggestions}
                disabled={isGettingSuggestions}
                variant="outline"
                size="sm"
                className="group absolute top-2 right-2 z-10 cursor-pointer border-white/20 bg-transparent text-xs"
              >
                {isGettingSuggestions ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Sparkles className="size-3" />
                )}
                Get Suggestions
              </Button>
            )}
            <ScoresCard
              scores={analysis.scores}
              analytics={analysis.analytics} // Ensure these props match ScoresCard
              content={content}
              analysis={analysis.analysis}
            />
          </div>
          <div className="sticky top-0 pt-5">
            <StyleExamples content={content} apiKey={apiKey} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
