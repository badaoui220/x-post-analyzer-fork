'use client';

import { useState, useEffect, useTransition } from 'react';
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

export function InspirationDialog({
  open,
  onClose,
  onExampleSelect,
  initialNiche = 'General',
  initialGoal = '', // Default to no goal selected initially
  niches,
}: InspirationDialogProps) {
  const [selectedNiche, setSelectedNiche] = useState(initialNiche);
  const [selectedGoal, setSelectedGoal] = useState(initialGoal);
  const [examples, setExamples] = useState<InspirationExample[]>([]);
  const [isPending, startTransition] = useTransition();

  // Reset filters when dialog opens based on initial props
  useEffect(() => {
    if (open) {
      setSelectedNiche(initialNiche);
      setSelectedGoal(initialGoal);
    }
  }, [open, initialNiche, initialGoal]);

  // Fetch examples when filters change or dialog opens
  useEffect(() => {
    if (open) {
      startTransition(async () => {
        const fetchedExamples = await getInspirationExamples(selectedNiche, selectedGoal || null);
        setExamples(fetchedExamples);
      });
    }
  }, [open, selectedNiche, selectedGoal]);

  const handleNicheChange = (niche: string) => {
    setSelectedNiche(niche);
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
            <Select value={selectedNiche} onValueChange={handleNicheChange} disabled={isPending}>
              <SelectTrigger
                id="niche-filter"
                className="w-full border-0 bg-[#2a2a2a] text-white placeholder:text-gray-500 focus:ring-1 focus:ring-white/20"
              >
                <SelectValue placeholder="Select niche" />
              </SelectTrigger>
              <SelectContent className="border border-[#333] bg-[#1a1a1a] text-white">
                {/* Include 'General' if it's in your main NICHES array */}
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
