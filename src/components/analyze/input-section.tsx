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
import { ArrowUp, Loader2, Key } from 'lucide-react';
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
}: InputSectionProps) {
  return (
    <motion.div key="input" className="relative mx-auto w-full max-w-lg space-y-4" {...slideUp}>
      {/* Personalization Selects */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="niche-select" className="mb-2 block text-sm font-medium text-white/60">
            Your Niche
          </Label>
          <Select value={selectedNiche} onValueChange={handleNicheChange} disabled={isAnalyzing}>
            <SelectTrigger
              id="niche-select"
              className="w-full border-0 bg-[#2a2a2a] text-white placeholder:text-gray-500 focus:ring-1 focus:ring-white/20"
            >
              <SelectValue placeholder="Select niche" />
            </SelectTrigger>
            <SelectContent className="border border-[#333] bg-[#1a1a1a] text-white">
              {NICHES.map(niche => (
                <SelectItem key={niche} value={niche} className="cursor-pointer hover:bg-[#2a2a2a]">
                  {niche}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
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
      </div>

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
          onClick={() => handleAnalyze(content)}
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
  );
}
