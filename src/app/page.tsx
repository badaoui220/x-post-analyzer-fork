import { AnalyzeForm } from '@/components/analyze/analyze-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'X Post Analyzer - AI-Powered Post Analysis',
  description:
    'Analyze your X (Twitter) posts with AI to improve engagement, friendliness, and virality. Get instant feedback and suggestions for better content.',
};

export default async function Home() {
  return (
    <main className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-8">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] grid-rows-[repeat(40,minmax(0,1fr))] opacity-[0.15]">
        {Array.from({ length: 1600 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-gray-100/20" />
        ))}
      </div>
      <AnalyzeForm />
    </main>
  );
}
