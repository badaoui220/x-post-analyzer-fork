/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion } from 'framer-motion';

import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Copy,
  Check,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Clock,
  Users,
  Sparkles,
  BookOpen,
  Smile,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Scale,
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface SuggestionsGridProps {
  suggestions: {
    text: string;
    analytics: any;
    scores: {
      engagement: number;
      friendliness: number;
      virality: number;
    };
  }[];
  onReanalyze: (text: string) => void;
  onSimulateABTest: (suggestion: {
    text: string;
    analytics: any;
    scores: {
      engagement: number;
      friendliness: number;
      virality: number;
    };
  }) => void;
  isAnalyzing: boolean;
  currentAnalyzing: string | null;
}

export function SuggestionsGrid({
  suggestions,
  onReanalyze,
  onSimulateABTest,
  isAnalyzing,
  currentAnalyzing,
}: SuggestionsGridProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success('Post copied to clipboard!', {
        className: 'bg-[#1a1a1a] border border-[#333] text-white',
        description: 'You can now paste it anywhere',
        duration: 2000,
      });
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to copy post', {
        className: 'bg-[#1a1a1a] border border-[#333] text-white',
      });
    }
  };

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {suggestions.map((suggestion, index) => {
        const analytics = suggestion.analytics;
        const isExpanded = expandedIndex === index;
        const isCurrentlyAnalyzing = currentAnalyzing === suggestion.text;

        const globalScore = Math.round(
          (suggestion?.scores.engagement +
            suggestion?.scores.friendliness +
            suggestion?.scores.virality) /
            3
        );

        return (
          <motion.div
            key={index}
            className="group relative overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] transition-colors hover:bg-[#1e1e1e]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <div className="relative p-4">
              {/* Profile Header */}
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-500 to-gray-700 text-white/30"></div>
                <div className="space-y-1">
                  <div className="h-4 w-28 rounded-3xl bg-gray-500"></div>
                  <div className="h-2 w-15 rounded-3xl bg-gray-500"></div>
                </div>
              </div>

              {/* Post Content */}
              <div>
                <p
                  className="mb-4 text-[15px] leading-normal text-white/90"
                  dangerouslySetInnerHTML={{
                    __html: suggestion.text,
                  }}
                ></p>

                {/* Post Metadata */}
                <div className="mb-4 text-sm text-gray-500">
                  12:00 PM · {new Date().toLocaleDateString()}
                </div>

                {/* Action Buttons */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary cursor-pointer text-white/60 hover:text-white"
                    onClick={() => handleCopy(suggestion.text, index)}
                  >
                    {copiedIndex === index ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                    {copiedIndex === index ? 'Copied!' : 'Copy'}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary cursor-pointer text-white/60 hover:text-white"
                    onClick={() => onReanalyze(suggestion.text)}
                    disabled={isAnalyzing}
                  >
                    <RefreshCw className={`size-4 ${isCurrentlyAnalyzing ? 'animate-spin' : ''}`} />
                    {isCurrentlyAnalyzing ? 'Analyzing...' : 'Re-analyze'}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary cursor-pointer text-white/60 hover:text-white"
                    onClick={() => onSimulateABTest(suggestion)}
                    disabled={isAnalyzing}
                  >
                    <Scale className="size-4" />
                    Compare
                  </Button>
                </div>

                {/* Engagement Metrics */}
                <div className="flex items-center justify-between border-y border-[#2a2a2a] py-3">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-gray-500 transition-colors hover:text-blue-400">
                      <MessageCircle className="size-4" />
                      <span className="text-sm">24</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 transition-colors hover:text-green-400">
                      <Repeat2 className="size-4" />
                      <span className="text-sm">12</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 transition-colors hover:text-pink-400">
                      <Heart className="size-4" />
                      <span className="text-sm">148</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 transition-colors hover:text-blue-400">
                      <Share className="size-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Basic Scores */}
              <div className="mt-4 space-y-3">
                <div className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-4xl font-bold text-transparent">
                  {globalScore}%
                </div>
                <div className="flex justify-between text-sm text-white/60">
                  <span>Engagement</span>
                  <span className="text-white">{suggestion.scores.engagement}%</span>
                </div>
                <Progress value={suggestion.scores.engagement} className="h-1 bg-[#2a2a2a]" />
                <div className="flex justify-between text-sm text-white/60">
                  <span>Friendliness</span>
                  <span className="text-white">{suggestion.scores.friendliness}%</span>
                </div>
                <Progress value={suggestion.scores.friendliness} className="h-1 bg-[#2a2a2a]" />
                <div className="flex justify-between text-sm text-white/60">
                  <span>Virality</span>
                  <span className="text-white">{suggestion.scores.virality}%</span>
                </div>
                <Progress value={suggestion.scores.virality} className="h-1 bg-[#2a2a2a]" />
              </div>

              {/* Advanced Analytics Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="mt-4 w-full"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="mr-2 size-4" />
                    Hide Analytics
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 size-4" />
                    Show Advanced Analytics
                  </>
                )}
              </Button>

              {/* Advanced Analytics Section */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 space-y-6 border-t border-[#2a2a2a] pt-4"
                >
                  {/* Readability */}
                  <div className="flex items-start gap-3">
                    <BookOpen className="mt-1 h-5 w-5 shrink-0 text-blue-400" />
                    <div>
                      <div className="mb-1 font-medium text-white">
                        Readability Score: {analytics.readability.score}%
                      </div>
                      <div className="text-sm text-gray-400">
                        {analytics.readability.level} - {analytics.readability.description}
                      </div>
                    </div>
                  </div>

                  {/* Sentiment */}
                  <div className="flex items-start gap-3">
                    <Smile className="mt-1 h-5 w-5 shrink-0 text-yellow-400" />
                    <div>
                      <div className="mb-1 font-medium text-white">
                        Sentiment: {analytics.sentiment.type}
                      </div>
                      <div className="text-sm text-gray-400">
                        Emotions: {analytics.sentiment.emotions.join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Timing */}
                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 h-5 w-5 shrink-0 text-green-400" />
                    <div>
                      <div className="mb-1 font-medium text-white">Best Posting Time</div>
                      <div className="text-sm text-gray-400">
                        {analytics.timing.bestTime} {analytics.timing.timezone}
                        <br />
                        Peak days: {analytics.timing.peakDays.join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div className="flex items-start gap-3">
                    <Users className="mt-1 h-5 w-5 shrink-0 text-orange-400" />
                    <div>
                      <div className="mb-1 font-medium text-white">Target Audience</div>
                      <div className="text-sm text-gray-400">
                        {analytics.audience.primary} (Age: {analytics.audience.age})
                        <br />
                        Interests: {analytics.audience.interests.join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-1 h-5 w-5 shrink-0 text-pink-400" />
                    <div>
                      <div className="mb-1 font-medium text-white">Optimal Keywords</div>
                      <div className="text-sm text-gray-400">
                        Optimal: {analytics.keywords.optimal.join(', ')}
                        <br />
                        Trending: {analytics.keywords.trending.join(', ')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
