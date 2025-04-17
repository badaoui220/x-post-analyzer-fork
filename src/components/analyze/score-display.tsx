'use client';

import { Progress } from '@/components/ui/progress';
import type { AnalysisResult } from '@/actions/analyze';

// Moved from analyze-form.tsx

interface ScoreDisplayProps {
  scores: AnalysisResult['scores'] | undefined | null;
}

export function ScoreDisplay({ scores }: ScoreDisplayProps) {
  if (!scores) return <div className="text-sm text-white/60">Scores not available.</div>;

  // Ensure only available scores are used if AnalysisResult type changes
  const availableScores = [scores.engagement, scores.friendliness, scores.virality].filter(
    score => typeof score === 'number'
  ) as number[];

  const globalScore =
    availableScores.length > 0
      ? Math.round(availableScores.reduce((a, b) => a + b, 0) / availableScores.length)
      : 0;

  return (
    <div className="space-y-3 rounded-md border border-[#2a2a2a] bg-[#222] p-4">
      <div className="text-center">
        <span className="text-xs text-white/60">Overall Score</span>
        <div className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-3xl font-bold text-transparent">
          {globalScore}%
        </div>
      </div>
      {/* Render only defined scores */}
      {scores.engagement !== undefined && (
        <ScoreItem label="Engagement" value={scores.engagement} />
      )}
      {scores.friendliness !== undefined && (
        <ScoreItem label="Friendliness" value={scores.friendliness} />
      )}
      {scores.virality !== undefined && <ScoreItem label="Virality" value={scores.virality} />}
      {/* Add other scores here if the type expands, e.g.:
      {scores.clarity !== undefined && <ScoreItem label="Clarity" value={scores.clarity} />} 
      {scores.polish !== undefined && <ScoreItem label="Polish" value={scores.polish} />}
      */}
    </div>
  );
}

interface ScoreItemProps {
  label: string;
  value: number;
}

function ScoreItem({ label, value }: ScoreItemProps) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-white/60">
        <span>{label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <Progress value={value} className="h-1 bg-[#333]" />
    </div>
  );
}
