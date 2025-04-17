/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import OpenAI from 'openai';
import Cookies from 'js-cookie';
import { DEFAULT_MODEL } from '@/config/openai';

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
  analysis: {
    synthesis: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

export async function analyzePost(content: string, apiKey: string): Promise<AnalysisResult> {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  const openai = new OpenAI({ apiKey });
  const model = Cookies.get('openai-model') || DEFAULT_MODEL;

  const messages = [
    {
      role: 'system',
      content: `You are an expert X (Twitter) post analyzer specializing in algorithm optimization. Analyze the post and provide:

      1. Engagement, friendliness, and virality scores (0-100)
      2. Advanced analytics (readability, sentiment, timing, etc.)
      3. A detailed analysis focusing on X's algorithm factors:
         - Recency and timeliness
         - Engagement potential (replies, retweets, likes)
         - Content type and media usage
         - Hashtag optimization
         - Account credibility factors
         - Relevancy and topic alignment
      
      Key Algorithm Factors to Consider:
      - Replies have 13.5x boost in ranking
      - Rich media (images/videos) get 2x ranking boost
      - Multiple hashtags cause 40% penalty
      - Trending topics give 1.1x boost
      - Verified accounts get visibility edge
      - Healthy follower ratios improve reach
      
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
        },
        "analysis": {
          "synthesis": "A clear, concise summary of the post's algorithm optimization and potential performance",
          "strengths": ["List of the post's main algorithm-friendly strengths"],
          "weaknesses": ["List of areas that could be improved for better algorithm performance"],
          "recommendations": [
            "Specific, actionable recommendations for algorithm optimization",
            "Focus on: engagement triggers, media usage, hashtag strategy, timing"
          ]
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
      model,
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
