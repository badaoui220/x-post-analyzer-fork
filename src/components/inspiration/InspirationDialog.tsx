'use client';

import { useState, useEffect, useTransition } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogOverlay,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getInspirationExamples, InspirationExample } from '@/actions/inspiration';
import { InspirationCard } from './InspirationCard';
import { Loader2 } from 'lucide-react';

interface InspirationDialogProps {
  open: boolean;
  onClose: () => void;
  onExampleSelect: (text: string) => void;
  initialNiche?: string;
  initialGoal?: string;
  niches: readonly string[]; // Pass available niches from AnalyzeForm
}

// Define the mapping here for clarity
const nicheToTopics: Record<string, string[]> = {
  Tech: ['Startup', 'SaaS', 'AI', 'Programming', 'Developer'],
  Marketing: ['Marketing', 'SEO', 'Audience building', 'Digital Marketing'],
  SaaS: ['SaaS', 'Startup', 'MRR', 'Productivity'],
  Creator: [
    'build in public',
    'indiehackers',
    'productivity',
    'vibe coding',
    'coding',
    'developer',
  ],
  Writing: ['Copywriting', 'Content Marketing', 'Blogging', 'Freelancing'],
  'E-commerce': ['E-commerce', 'Retail'],
  Finance: ['Finance', 'Investment', 'Personal Finance', 'Stocks', 'Cryptocurrency'],
  General: ['Startup', 'Marketing', 'Productivity', 'Personal Branding'], // Default/fallback
};

export function InspirationDialog({
  open,
  onClose,
  onExampleSelect,
  initialNiche = 'General',
  initialGoal = '',
  niches, // Keep receiving the list of allowed niches
}: InspirationDialogProps) {
  const [selectedNiche, setSelectedNiche] = useState(initialNiche);
  // selectedGoal state is kept for context but not used for API query directly anymore
  const [selectedGoal, setSelectedGoal] = useState(initialGoal);
  const [examples, setExamples] = useState<InspirationExample[]>([]);
  const [usernameQuery, setUsernameQuery] = useState('');
  const debouncedUsernameQuery = useDebounce(usernameQuery, 1000);
  const [isPending, startTransition] = useTransition();

  // Reset filters when dialog opens based on initial props
  useEffect(() => {
    if (open) {
      setSelectedNiche(initialNiche);
      setSelectedGoal(initialGoal);
      setUsernameQuery('');
    }
  }, [open, initialNiche, initialGoal]);

  // Fetch examples based on username OR niche filter
  useEffect(() => {
    if (open) {
      let searchQuery = '';
      let nicheForContext = selectedNiche; // Keep track of the selected niche for context

      // Prioritize username search
      if (debouncedUsernameQuery && debouncedUsernameQuery.trim()) {
        searchQuery = `@${debouncedUsernameQuery.trim().replace('@', '')}`;
        // Optionally reset niche display when username is searched, or keep it for context
        // setSelectedNiche('General'); // Example: Reset niche visually if desired
        nicheForContext = 'Username Search'; // Indicate context is different
      } else {
        // Fallback to niche search
        const topics = nicheToTopics[selectedNiche] || nicheToTopics['General'];
        searchQuery = topics.join(',');
        nicheForContext = selectedNiche; // Context is the selected niche
      }

      if (!searchQuery) return; // Don't fetch if query is empty

      startTransition(async () => {
        const fetchedExamples = await getInspirationExamples(searchQuery, nicheForContext);
        setExamples(fetchedExamples);
      });
    }
  }, [open, selectedNiche, selectedGoal, debouncedUsernameQuery]); // Include selectedGoal if it affects context

  // When niche changes, clear username search to avoid confusion
  const handleNicheValueChange = (niche: string) => {
    setSelectedNiche(niche);
    setUsernameQuery(''); // Clear username when niche is explicitly selected
  };

  // When username input changes, maybe clear niche selection visually?
  // Or just let the useEffect logic prioritize username input.
  const handleUsernameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameQuery(e.target.value);
    // Optionally: setSelectedNiche('General'); // If you want to reset niche dropdown display
  };

  // Handler to be passed to InspirationCard
  const handleCardSelect = (text: string) => {
    onExampleSelect(text); // Pass the text up to the parent (AnalyzeForm)
    onClose(); // Close the dialog
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogOverlay className="bg-black/50 backdrop-blur-sm" />
      <AlertDialogContent className="w-full max-w-2xl border-[#333] bg-[#1a1a1a] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Inspiration Library</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {/* Niche Filter */}
          <div>
            <Label htmlFor="niche-filter" className="mb-2 block text-sm font-medium text-white/60">
              Filter by Niche
            </Label>
            <Select
              value={selectedNiche}
              onValueChange={handleNicheValueChange}
              disabled={isPending}
            >
              <SelectTrigger
                id="niche-filter"
                className="w-full border-0 bg-[#2a2a2a] text-white placeholder:text-gray-500 focus:ring-1 focus:ring-white/20"
              >
                <SelectValue placeholder="Select niche" />
              </SelectTrigger>
              <SelectContent className="border border-[#333] bg-[#1a1a1a] text-white">
                {niches.map(niche => (
                  <SelectItem
                    key={niche}
                    value={niche}
                    className="cursor-pointer hover:bg-[#2a2a2a]"
                  >
                    {niche}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Username Search Input */}
          <div>
            <Label
              htmlFor="username-search"
              className="mb-2 block text-sm font-medium text-white/60"
            >
              OR Search by Username (@)
            </Label>
            <Input
              id="username-search"
              type="text"
              placeholder="e.g., johndoe (without @)"
              value={usernameQuery}
              onChange={handleUsernameInputChange}
              className="w-full border-0 bg-[#2a2a2a] text-white placeholder:text-gray-500 focus:ring-1 focus:ring-white/20"
              disabled={isPending}
            />
          </div>
        </div>

        <ScrollArea className="h-[50vh] pr-4">
          <div className="space-y-4">
            {isPending ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white/50" />
              </div>
            ) : examples.length > 0 ? (
              examples.map(ex => (
                <InspirationCard key={ex.id} example={ex} onSelect={handleCardSelect} />
              ))
            ) : (
              <p className="py-8 text-center text-white/50">
                No examples found for this combination.
              </p>
            )}
          </div>
        </ScrollArea>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel
            onClick={onClose}
            className="border-[#333] bg-[#2a2a2a] text-white hover:bg-[#333]"
          >
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
