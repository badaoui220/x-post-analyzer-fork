'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { analyzePost } from '@/actions/analyze';
import { getSuggestions } from '@/actions/suggestions';
import type { AnalysisResult } from '@/actions/analyze';
import type { Suggestion } from '@/actions/suggestions';
import { ScoresCard } from './scores-card';
import { SuggestionsGrid } from './suggestions-grid';
import { ApiKeyDialog } from '@/components/api-key-dialog';
import { AnalysisSkeleton, SuggestionsSkeleton } from '@/components/analysis-skeleton';
import Cookies from 'js-cookie';
import { ArrowUp, Loader2, Key, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { DEFAULT_MODEL, AVAILABLE_MODELS, DEFAULT_API_KEY } from '@/config/openai';
import { cn } from '@/lib/utils';
import { StyleExamples } from './style-examples';
import { PostPreviewSpot } from '../spots/post-preview-spot';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 },
};

const slideUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
  transition: { duration: 0.5 },
};

export function AnalyzeForm() {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGettingSuggestions, setIsGettingSuggestions] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [currentAnalyzing, setCurrentAnalyzing] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [isUsingDefaultKey, setIsUsingDefaultKey] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedModel = Cookies.get('openai-model');
    if (storedModel) {
      setSelectedModel(storedModel);
    }
    const savedApiKey = Cookies.get('openai-api-key');
    setIsUsingDefaultKey(!savedApiKey);
  }, []);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    Cookies.set('openai-model', model, { expires: 30 });
  };

  const MAX_LENGTH = 280; // X's character limit
  const apiKey = Cookies.get('openai-api-key') || DEFAULT_API_KEY;

  const getCharacterCountColor = (count: number) => {
    if (count >= MAX_LENGTH) return 'text-red-500';
    if (count >= MAX_LENGTH * 0.9) return 'text-yellow-500';
    if (count >= MAX_LENGTH * 0.7) return 'text-orange-500';
    return 'text-green-500';
  };

  const getProgressBarColor = (count: number) => {
    if (count >= MAX_LENGTH) return 'bg-red-500';
    if (count >= MAX_LENGTH * 0.9) return 'bg-yellow-500';
    if (count >= MAX_LENGTH * 0.7) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const handleAnalyze = async (text: string = content) => {
    if (!apiKey) {
      setShowApiKeyDialog(true);
      return;
    }

    setIsAnalyzing(true);
    setCurrentAnalyzing(text);
    setShowSuggestions(false);
    setSuggestions(null);
    try {
      const result = await analyzePost(text, apiKey);
      if (result) {
        setAnalysis(result);
        setContent(text);
      }
    } catch (error) {
      console.error('Error analyzing post:', error);
      if (error instanceof Error && error.message.includes('API key')) {
        setShowApiKeyDialog(true);
      }
      toast.error('Failed to analyze post', {
        className: 'bg-[#1a1a1a] border border-[#333] text-white',
      });
    } finally {
      setIsAnalyzing(false);
      setCurrentAnalyzing(null);
    }
  };

  const handleGetSuggestions = async () => {
    if (!apiKey) {
      setShowApiKeyDialog(true);
      return;
    }

    setIsGettingSuggestions(true);
    try {
      setTimeout(() => {
        if (suggestionsRef.current) {
          const element = suggestionsRef.current;
          const headerOffset = 100; // Adjust this value based on your header height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          console.log('offsetPosition', offsetPosition);

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 100);
      const result = await getSuggestions(content, apiKey);
      setSuggestions(result);
      setShowSuggestions(true);
      console.log('suggestionsRef.current', suggestionsRef.current);
      // Add a small delay to ensure the suggestions section is rendered
    } catch (error) {
      console.error('Error getting suggestions:', error);
      toast.error('Failed to get suggestions', {
        className: 'bg-[#1a1a1a] border border-[#333] text-white',
      });
    } finally {
      setIsGettingSuggestions(false);
    }
  };

  const handleReanalyze = async (text: string) => {
    const apiKey = Cookies.get('openai-api-key') || DEFAULT_API_KEY;
    if (!apiKey) {
      setShowApiKeyDialog(true);
      return;
    }

    // Clear states first
    setAnalysis(null);
    setIsAnalyzing(true);
    setIsGettingSuggestions(true);
    setCurrentAnalyzing(text);
    setSuggestions(null);

    // Scroll to top with a slight delay to ensure state updates have processed
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      // Fallback for Safari
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 100);

    try {
      // Run analysis and get suggestions in parallel
      const [analysisResult, suggestionsResult] = await Promise.all([
        analyzePost(text, apiKey),
        getSuggestions(text, apiKey),
      ]);

      if (analysisResult) {
        setAnalysis(analysisResult);
        setContent(text);
      }
      if (suggestionsResult) {
        setSuggestions(suggestionsResult);
      }
    } catch (error) {
      console.error('Error during reanalysis:', error);
      if (error instanceof Error && error.message.includes('API key')) {
        setShowApiKeyDialog(true);
      }
      toast.error('Failed to reanalyze post', {
        className: 'bg-[#1a1a1a] border border-[#333] text-white',
      });
    } finally {
      setIsAnalyzing(false);
      setIsGettingSuggestions(false);
      setCurrentAnalyzing(null);
    }
  };

  const handleApiKeySave = () => {
    const savedApiKey = Cookies.get('openai-api-key');
    setIsUsingDefaultKey(!savedApiKey);
    setShowApiKeyDialog(false);
  };

  const handleReturn = () => {
    setAnalysis(null);
    setSuggestions(null);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!analysis && !isAnalyzing && (
          <motion.div key="header" {...fadeIn} className="relative mb-8 space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mx-auto mb-8 h-16 w-16"
            >
              <div className="bg-primary/20 absolute inset-0 rounded-2xl blur-xl" />
              <div className="relative rounded-2xl bg-white p-4 shadow-lg">
                <span className="text-2xl font-bold text-black">𝕏</span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4 text-4xl font-bold tracking-tight md:text-6xl"
            >
              𝕏 Post Analyzer
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground mx-auto max-w-2xl text-xl"
            >
              Get AI-powered insights to improve your posts&apos; engagement and reach
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full space-y-6">
        <div
          id="analysis-section"
          className={cn('relative mx-auto flex w-full max-w-4xl flex-col items-center')}
        >
          <AnimatePresence mode="wait">
            {!analysis && !isAnalyzing && (
              <motion.div
                key="input"
                className="relative mx-auto w-full max-w-lg space-y-4"
                {...slideUp}
              >
                <div className="relative">
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
                    disabled={isAnalyzing}
                    className="monospace min-h-[200px] w-full resize-none rounded-xl border-0 bg-[#1a1a1a] pr-24 pb-14 text-white transition-all duration-300 placeholder:text-gray-500 focus:border-transparent focus:ring-1 focus:ring-white/20"
                  />
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                    <span
                      className={cn(
                        'text-sm font-medium transition-colors duration-200',
                        getCharacterCountColor(content.length)
                      )}
                    >
                      {content.length}/{MAX_LENGTH}
                    </span>
                    <div className="h-1 w-16 overflow-hidden rounded-full bg-[#333]">
                      <div
                        className={cn(
                          'h-full transition-all duration-200',
                          getProgressBarColor(content.length)
                        )}
                        style={{
                          width: `${Math.min((content.length / MAX_LENGTH) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-6 mt-1 flex w-full items-center justify-between bg-[#1a1a1a] px-2">
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedModel}
                      onValueChange={handleModelChange}
                      disabled={isAnalyzing || isUsingDefaultKey}
                    >
                      <SelectTrigger className="w-32 border-none bg-[#2a2a2a] text-white">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent className="border border-[#333] bg-[#1a1a1a] text-white">
                        {AVAILABLE_MODELS.map(model => (
                          <SelectItem
                            key={model.id}
                            value={model.id}
                            className="cursor-pointer hover:bg-[#2a2a2a]"
                            disabled={isUsingDefaultKey && model.id !== DEFAULT_MODEL}
                          >
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKeyDialog(true)}
                      className="text-white/60 hover:bg-white/10 hover:text-white"
                    >
                      <Key className="h-4 w-4" />
                      Own key
                    </Button>
                  </div>
                  <Button
                    onClick={() => handleAnalyze()}
                    disabled={!content.trim() || isAnalyzing}
                    variant="secondary"
                    size="icon"
                    className="group cursor-pointer"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="size-5 animate-spin stroke-3" />
                    ) : (
                      <ArrowUp className="size-4 stroke-3 transition-transform group-hover:-translate-y-0.5" />
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <AnalysisSkeleton />
              </motion.div>
            )}

            {analysis && (
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
                  <PostPreviewSpot
                    id="spot-analysis-top"
                    content={content}
                    scores={analysis?.scores}
                  />

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
                        analytics={analysis.analytics}
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
            )}
          </AnimatePresence>
        </div>

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
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Suggestions</h2>
                <SuggestionsGrid
                  suggestions={suggestions}
                  onReanalyze={handleReanalyze}
                  isAnalyzing={isAnalyzing}
                  currentAnalyzing={currentAnalyzing}
                />
              </div>
            )}
          </div>
        </AnimatePresence>
      </div>

      <ApiKeyDialog
        open={showApiKeyDialog}
        onClose={() => setShowApiKeyDialog(false)}
        onSave={handleApiKeySave}
      />
    </>
  );
}
