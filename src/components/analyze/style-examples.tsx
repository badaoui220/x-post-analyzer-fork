'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Repeat2, Copy, Check } from 'lucide-react';
import { rewritePost } from '@/actions/rewrite';
import creatorsData from '@/data/creators.json';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

function kConverter(num: number) {
  return num <= 999 ? num : (0.1 * Math.floor(num / 100)).toFixed(1).replace('.0', '') + 'k';
}

interface Tweet {
  text: string;
  metrics: {
    likes: number;
    comments: number;
    reposts: number;
  };
}

interface Creator {
  name: string;
  handle: string;
  avatar: string;
  recentTweets: Tweet[];
}

interface Example {
  creator: Creator;
  text: string;
  scores: {
    engagement: number;
    friendliness: number;
    virality: number;
  };
  metrics: {
    likes: number;
    comments: number;
    reposts: number;
    impressions: number;
  };
}

interface StyleExamplesProps {
  content: string;
  apiKey: string;
}

function ExampleSkeleton() {
  return (
    <Card className="border-0 bg-[#1a1a1a]">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Skeleton className="bg-accent/10 h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="bg-accent/10 h-4 w-24" />
              <Skeleton className="bg-accent/10 h-4 w-16" />
              <Skeleton className="bg-accent/10 h-4 w-12" />
            </div>
            <Skeleton className="bg-accent/10 h-20 w-full" />
            <div className="flex space-x-4">
              <Skeleton className="bg-accent/10 h-8 w-16" />
              <Skeleton className="bg-accent/10 h-8 w-16" />
              <Skeleton className="bg-accent/10 h-8 w-16" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StyleExamples({ content, apiKey }: StyleExamplesProps) {
  const [examples, setExamples] = useState<Example[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success('Post copied to clipboard!', {
        className: 'bg-[#1a1a1a] border border-[#333] text-white',
        description: 'You can now paste it anywhere',
        duration: 2000,
      });
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      toast.error('Failed to copy post', {
        className: 'bg-[#1a1a1a] border border-[#333] text-white',
      });
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchRewrittenPosts = async () => {
      setLoading(true);
      setError(null);
      setExamples([]);
      setCurrentIndex(0);

      for (let i = 0; i < creatorsData.creators.length; i++) {
        if (!isMounted) return;

        const creator = creatorsData.creators[i];
        try {
          const result = await rewritePost(content, creator.handle.replace('@', ''), apiKey);

          if (isMounted) {
            setExamples(prev => [
              ...prev,
              {
                creator,
                text: result.text,
                scores: result.scores,
                metrics: result.metrics,
              },
            ]);
            setCurrentIndex(i + 1);
          }
        } catch (err) {
          console.error(err);
          if (isMounted) {
            setError(`Failed to generate example for ${creator.name}`);
            setCurrentIndex(i + 1);
          }
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    fetchRewrittenPosts();

    return () => {
      isMounted = false;
    };
  }, [content, apiKey]);

  return (
    <div className="space-y-4">
      {loading && (
        <div className="text-muted-foreground text-sm">
          Generating example {currentIndex + 1} of {creatorsData.creators.length}...
        </div>
      )}

      {error && <div className="text-destructive text-sm">{error}</div>}

      <div className="grid gap-4">
        {creatorsData.creators.map((creator, index) => {
          const example = examples[index];

          if (!example) {
            return <ExampleSkeleton key={creator.handle} />;
          }

          return (
            <Card key={creator.handle} className="border-0 bg-[#1a1a1a] p-0">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                      {creator.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center gap-1 font-semibold text-white">
                          {creator.name}

                          <svg
                            className="h-4 w-4 text-[#1d9bf0]"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                          </svg>
                        </span>
                        <span className="text-xs text-gray-400">{creator.handle}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary cursor-pointer text-white/60 hover:text-white"
                        onClick={() => handleCopy(example.text, index)}
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="mt-2 text-white">{example.text}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-blue-500"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">{kConverter(example.metrics.comments)}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-green-500"
                        >
                          <Repeat2 className="h-4 w-4" />
                          <span className="text-sm">{kConverter(example.metrics.reposts)}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{kConverter(example.metrics.likes)}</span>
                        </Button>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <svg
                            className="h-[1.25em]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                            />
                          </svg>
                          <span>{kConverter(example.metrics.impressions)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
