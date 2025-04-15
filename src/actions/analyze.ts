/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import OpenAI from 'openai';

export interface AdvancedAnalytics {
  readability: {
    score: number;
    level: string;
    description: string;
  };
  sentiment: {
    score: number;
    type: string;
    emotions: string[];
  };
  timing: {
    bestTime: string;
    timezone: string;
    peakDays: string[];
  };
  hashtags: {
    recommended: string[];
    reach: string;
  };
  audience: {
    primary: string;
    interests: string[];
    age: string;
  };
  keywords: {
    optimal: string[];
    trending: string[];
  };
}

export interface AnalysisResult {
  scores: {
    engagement: number;
    friendliness: number;
    virality: number;
  };
  analytics: AdvancedAnalytics;
}

export async function analyzePost(content: string, apiKey: string): Promise<AnalysisResult> {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  const openai = new OpenAI({ apiKey });

  const messages = [
    {
      role: 'system',
      content: `Analyze this X (Twitter) post and provide:
      1. Engagement score (0-100)
      2. Friendliness score (0-100)
      3. Virality score (0-100)
      4. Advanced analytics including:
         - Readability analysis (score, level, grade-level description)
         - Sentiment analysis (score, type, key emotions)
         - Best posting time (time window, timezone, peak days)
         - Hashtag recommendations (list, potential reach)
         - Target audience (primary demographic, interests, age range)
         - Keywords (optimal words, trending terms)
      
      Respond in this JSON format:
      {
        "scores": {
          "engagement": number,
          "friendliness": number,
          "virality": number
        },
        "analytics": {
          "readability": {
            "score": number,
            "level": string,
            "description": string
          },
          "sentiment": {
            "score": number,
            "type": string,
            "emotions": string[]
          },
          "timing": {
            "bestTime": string,
            "timezone": string,
            "peakDays": string[]
          },
          "hashtags": {
            "recommended": string[],
            "reach": string
          },
          "audience": {
            "primary": string,
            "interests": string[],
            "age": string
          },
          "keywords": {
            "optimal": string[],
            "trending": string[]
          }
        }
      }`,
    },
    {
      role: 'user',
      content,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages as any,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}') as AnalysisResult;
    return response;
  } catch (error) {
    console.error('Error analyzing post:', error);
    throw error;
  }
}
