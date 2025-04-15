'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { analyzePost } from '@/actions/analyze';
import type { AnalysisResult } from '@/actions/analyze';
import { ScoresCard } from './scores-card';
import { SuggestionsGrid } from './suggestions-grid';
import { ApiKeyDialog } from '../api-key-dialog';
import Cookies from 'js-cookie';
import { ArrowUp, Loader2 } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export function AnalyzeForm() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  const MAX_LENGTH = 280; // X's character limit

  const handleAnalyze = async () => {
    const apiKey = Cookies.get('openai-api-key');
    if (!apiKey) {
      setShowApiKeyDialog(true);
      return;
    }

    setIsLoading(true);
    try {
      const analysis = await analyzePost(content);
      if (analysis) {
        setResult(analysis);
      }
    } catch (error) {
      console.error('Error analyzing post:', error);
      // If the error is due to invalid API key, show the dialog
      if (error instanceof Error && error.message.includes('API key')) {
        setShowApiKeyDialog(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySave = () => {
    setShowApiKeyDialog(false);
    handleAnalyze();
  };

  return (
    <>
      {!result && (
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">𝕏 Post Analyzer</h1>
          <p className="text-gray-400">
            Get AI-powered insights to improve your posts&apos; engagement and reach
          </p>
        </div>
      )}

      <motion.div
        className="w-full space-y-6"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <div className="relative mx-auto flex w-full max-w-lg flex-col items-center">
          {!result && (
            <>
              <Textarea
                placeholder="What's on your mind? Paste or type your X post here..."
                value={content}
                onChange={e => {
                  const text = e.target.value;
                  if (text.length <= MAX_LENGTH) {
                    setContent(text);
                  }
                }}
                maxLength={MAX_LENGTH}
                disabled={isLoading}
                className="monospace min-h-[200px] w-full resize-none rounded-xl border-0 bg-[#1a1a1a] pr-24 text-white transition-all duration-300 placeholder:text-gray-500 focus:border-transparent focus:ring-1 focus:ring-white/20"
              />
              <div className="absolute right-3 top-3 text-sm text-white/40">
                {content.length}/{MAX_LENGTH}
              </div>
              <div className="absolute bottom-3 right-3 mt-1 flex items-center justify-end">
                <Button
                  onClick={handleAnalyze}
                  disabled={!content.trim() || isLoading}
                  variant="default"
                  size="icon"
                  className="focus-visible:ring-ring focus-visible:ring-offset-background border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer shadow-[inset_0_0.5px_2px_rgba(255,255,255,0.3)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&>svg+svg]:hidden"
                >
                  {isLoading ? (
                    <Loader2 className="stroke-3 size-5 animate-spin" />
                  ) : (
                    <ArrowUp className="stroke-3 size-4" />
                  )}
                </Button>
              </div>
            </>
          )}

          {result && (
            <ScoresCard scores={result.scores} analytics={result.analytics} content={content} />
          )}
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 space-y-4"
          >
            <h2 className="text-2xl font-bold">Suggestions</h2>
            <SuggestionsGrid suggestions={result.suggestions} />
          </motion.div>
        )}
      </motion.div>

      <ApiKeyDialog
        open={showApiKeyDialog}
        onClose={() => setShowApiKeyDialog(false)}
        onSave={handleApiKeySave}
      />
    </>
  );
}
