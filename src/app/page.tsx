import { AnalyzeForm } from '@/components/analyze/analyze-form';
import { ApiKeyDialogWrapper } from '@/components/api-key-dialog-wrapper';
import { cookies } from 'next/headers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Analyze your X (Twitter) posts with AI to improve engagement, friendliness, and virality. Get instant feedback and suggestions for better content.',
  openGraph: {
    title: 'X Post Analyzer - AI-Powered Post Analysis',
    description:
      'Analyze your X (Twitter) posts with AI to improve engagement, friendliness, and virality.',
  },
  twitter: {
    title: 'X Post Analyzer - AI-Powered Post Analysis',
    description:
      'Analyze your X (Twitter) posts with AI to improve engagement, friendliness, and virality.',
  },
};

export default async function Home() {
  const cookieStore = await cookies();
  const hasApiKey = cookieStore.get('openai-api-key') !== undefined;

  return (
    <main className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-8">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] grid-rows-[repeat(40,minmax(0,1fr))] opacity-[0.15]">
        {Array.from({ length: 1600 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-gray-100/20" />
        ))}
      </div>
      <AnalyzeForm />
      {!hasApiKey && <ApiKeyDialogWrapper />}
    </main>
  );
}
