'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowUp, Loader2, Key, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AVAILABLE_MODELS, DEFAULT_MODEL } from '@/config/openai';

// Constants passed as props or defined here if static
// const NICHES = [...];
// const GOALS = [...];

interface InputSectionProps {
  content: string;
  setContent: (content: string) => void;
  selectedNiche: string;
  handleNicheChange: (niche: string) => void;
  selectedGoal: string;
  handleGoalChange: (goal: string) => void;
  selectedModel: string;
  handleModelChange: (model: string) => void;
  isAnalyzing: boolean;
  isUsingDefaultKey: boolean;
  handleAnalyze: (text: string) => void;
  setShowApiKeyDialog: (show: boolean) => void;
  getCharacterCountColor: (count: number) => string;
  getProgressBarColor: (count: number) => string;
  MAX_LENGTH: number;
  NICHES: readonly string[];
  GOALS: readonly string[];
  hasVisualContent: boolean;
  setHasVisualContent: (checked: boolean) => void;
  onShowInspiration: () => void;
}

const slideUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
  transition: { duration: 0.5 },
};

export function InputSection({
  content,
  setContent,
  selectedNiche,
  handleNicheChange,
  selectedGoal,
  handleGoalChange,
  selectedModel,
  handleModelChange,
  isAnalyzing,
  isUsingDefaultKey,
  handleAnalyze,
  setShowApiKeyDialog,
  getCharacterCountColor,
  getProgressBarColor,
  MAX_LENGTH,
  NICHES,
  GOALS,
  hasVisualContent,
  setHasVisualContent,
  onShowInspiration,
}: InputSectionProps) {
  return (
    <motion.div key="input" className="relative mx-auto w-full max-w-2xl space-y-4" {...slideUp}>
      {/* Combined Goal Select and Visual Switch Row */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col">
          <Label htmlFor="goal-select" className="mb-2 block text-sm font-medium text-white/60">
            Primary Goal
          </Label>
          <Select value={selectedGoal} onValueChange={handleGoalChange} disabled={isAnalyzing}>
            <SelectTrigger
              id="goal-select"
              className="w-full border-0 bg-[#2a2a2a] text-white placeholder:text-gray-500 focus:ring-1 focus:ring-white/20"
            >
              <SelectValue placeholder="Select goal" />
            </SelectTrigger>
            <SelectContent className="border border-[#333] bg-[#1a1a1a] text-white">
              {GOALS.map(goal => (
                <SelectItem key={goal} value={goal} className="cursor-pointer hover:bg-[#2a2a2a]">
                  {goal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Visual Content Switch */}
        <div className="flex items-center space-x-2 pb-2">
          <Switch
            id="visual-content-switch"
            checked={hasVisualContent}
            onCheckedChange={setHasVisualContent}
            disabled={isAnalyzing}
            aria-label="Post includes image or video"
          />
          <Label htmlFor="visual-content-switch" className="text-sm font-medium text-white/60">
            Post includes image or video
          </Label>
        </div>
      </div>

      {/* Removed Niche Select from here */}
      {/* Removed full-width Inspiration Button from here */}

      <div className="relative">
        <Textarea
          placeholder="What's on your mind? Paste or type your X post here..."
          value={content}
          onChange={e => {
            const text = e.target.value;
            // Ensure MAX_LENGTH check remains or is passed via props
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
              'monospace text-sm font-medium transition-colors duration-200',
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
        {/* Updated Textarea Bottom Bar */}
        <div className="absolute right-0 bottom-0 left-0 flex items-center justify-between bg-[#1a1a1a] px-3 py-2">
          {/* Left side controls */}
          <div className="flex items-center gap-2">
            <Select
              value={selectedModel}
              onValueChange={handleModelChange}
              disabled={isAnalyzing || isUsingDefaultKey}
            >
              <SelectTrigger className="h-8 w-auto border-none bg-[#2a2a2a] px-3 text-xs text-white">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent className="border border-[#333] bg-[#1a1a1a] text-white">
                {AVAILABLE_MODELS.map(model => (
                  <SelectItem
                    key={model.id}
                    value={model.id}
                    className="cursor-pointer text-xs hover:bg-[#2a2a2a]"
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
              className="h-8 gap-1 px-2 text-xs text-white/60 hover:bg-white/10 hover:text-white"
            >
              <Key className="h-3 w-3" />
              <span>Or use your key</span>
            </Button>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            <Select value={selectedNiche} onValueChange={handleNicheChange} disabled={isAnalyzing}>
              <SelectTrigger
                id="niche-select-bottom"
                className="h-8 w-auto border-none bg-[#2a2a2a] px-3 text-xs text-white placeholder:text-gray-400 focus:ring-0"
                aria-label="Choose a niche"
              >
                <SelectValue placeholder="Choose a niche" />
              </SelectTrigger>
              <SelectContent className="border border-[#333] bg-[#1a1a1a] text-white">
                {NICHES.map(niche => (
                  <SelectItem
                    key={niche}
                    value={niche}
                    className="cursor-pointer text-xs hover:bg-[#2a2a2a]"
                  >
                    {niche}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Inspiration Icon Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={onShowInspiration}
              className="relative h-8 w-8 shrink-0 overflow-hidden border-0 bg-[#2a2a2a] p-[1px] text-white/60 hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none"
              aria-label="Show Inspiration Library"
              disabled={isAnalyzing}
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-sm bg-[#2a2a2a] px-3 py-1 text-sm font-medium backdrop-blur-3xl">
                <Sparkles className="h-4 w-4" />
              </span>
            </Button>
            {/* Analyze Button */}
            <Button
              onClick={() => handleAnalyze(content)}
              disabled={!content.trim() || isAnalyzing}
              variant="secondary"
              size="icon"
              className="group h-8 w-8 cursor-pointer"
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
