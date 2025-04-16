'use client';

import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Smile, Clock, Hash, Users, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactConfetti from 'react-confetti';

interface AdvancedAnalytics {
  readability: {
    score: number;
    level: string;
    description: string;
  };
  sentiment: {
    score: number;
    type: string;
    emotions: string[];
  };
  timing: {
    bestTime: string;
    timezone: string;
    peakDays: string[];
  };
  hashtags: {
    recommended: string[];
    reach: string;
  };
  audience: {
    primary: string;
    interests: string[];
    age: string;
  };
  keywords: {
    optimal: string[];
    trending: string[];
  };
}

interface ScoresCardProps {
  scores: {
    engagement: number;
    friendliness: number;
    virality: number;
  };
  analytics: AdvancedAnalytics;
}

export function ScoresCard({ scores, analytics }: ScoresCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const globalScore = Math.round((scores.engagement + scores.friendliness + scores.virality) / 3);

  // Determine gradient colors based on global score
  const getGradientColors = (score: number) => {
    if (score < 40) {
      return 'from-red-500/20 via-red-500/10 to-transparent';
    } else if (score < 70) {
      return 'from-yellow-500/20 via-yellow-500/10 to-transparent';
    } else {
      return 'from-green-500/20 via-green-500/10 to-transparent';
    }
  };

  useEffect(() => {
    if (isInView) {
      const animation = animate(count, globalScore, {
        duration: 2,
        ease: 'easeOut',
      });
      return animation.stop;
    }
  }, [globalScore, isInView, count]);

  useEffect(() => {
    // Initialize window size
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initial size
    updateWindowSize();

    // Add resize listener
    window.addEventListener('resize', updateWindowSize);

    // Show confetti after component mounts and window size is set
    return () => {
      window.removeEventListener('resize', updateWindowSize);
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-50">
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          wind={0.05}
          colors={['#FFD700', '#FFA500', '#FF69B4', '#87CEEB', '#98FB98']}
          style={{ position: 'fixed', top: 0, left: 0 }}
        />
      </div>
      <motion.div
        ref={ref}
        className="relative space-y-6 overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Gradient background overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getGradientColors(
            globalScore
          )} opacity-30 blur-xl`}
        />

        {/* Content */}
        <div className="relative z-10">
          <motion.div
            className="mb-8 flex flex-col items-center justify-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <div className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-5xl font-bold text-transparent">
              <motion.span>{rounded}</motion.span>%
            </div>
            <div className="mt-2 text-sm text-white/60">Global Score</div>
          </motion.div>

          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="mb-2 flex justify-between text-white/80">
                <span>Engagement</span>
                <span>{scores.engagement}%</span>
              </div>
              <Progress value={scores.engagement} className="h-1.5 bg-[#2a2a2a]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="mb-2 flex justify-between text-white/80">
                <span>Friendliness</span>
                <span>{scores.friendliness}%</span>
              </div>
              <Progress value={scores.friendliness} className="h-1.5 bg-[#2a2a2a]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="mb-2 flex justify-between text-white/80">
                <span>Virality</span>
                <span>{scores.virality}%</span>
              </div>
              <Progress value={scores.virality} className="h-1.5 bg-[#2a2a2a]" />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 grid grid-cols-2 gap-4 space-y-6 border-t border-[#2a2a2a] pt-4"
          >
            {/* Readability */}
            <div className="flex items-start gap-3">
              <BookOpen className="mt-1 h-5 w-5 text-blue-400" />
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
              <Smile className="mt-1 h-5 w-5 text-yellow-400" />
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
              <Clock className="mt-1 h-5 w-5 text-green-400" />
              <div>
                <div className="mb-1 font-medium text-white">Best Posting Time</div>
                <div className="text-sm text-gray-400">
                  {analytics.timing.bestTime} {analytics.timing.timezone}
                  <br />
                  Peak days: {analytics.timing.peakDays.join(', ')}
                </div>
              </div>
            </div>

            {/* Hashtags */}
            <div className="flex items-start gap-3">
              <Hash className="mt-1 h-5 w-5 text-purple-400" />
              <div>
                <div className="mb-1 font-medium text-white">Recommended Hashtags</div>
                <div className="text-sm text-gray-400">
                  {analytics.hashtags.recommended.join(' ')}
                  <br />
                  {analytics.hashtags.reach}
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div className="flex items-start gap-3">
              <Users className="mt-1 h-5 w-5 text-orange-400" />
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
              <Sparkles className="mt-1 h-5 w-5 text-pink-400" />
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
        </div>
      </motion.div>
    </>
  );
}
