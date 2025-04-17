/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import OpenAI from 'openai';
import Cookies from 'js-cookie';
import type { AdvancedAnalytics } from './analyze';
import { DEFAULT_MODEL } from '@/config/openai';

export interface Suggestion {
  text: string;
  scores: {
    engagement: number;
    friendliness: number;
    virality: number;
  };
  analytics: AdvancedAnalytics;
}

export async function getSuggestions(
  content: string,
  apiKey: string,
  niche?: string,
  goal?: string
): Promise<Suggestion[]> {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  if (!content || typeof content !== 'string' || content.trim() === '') {
    console.warn('Invalid content provided for suggestions. Returning empty array.');
    return [];
  }

  const openai = new OpenAI({ apiKey });
  const model = Cookies.get('openai-model') || DEFAULT_MODEL;

  const messages = [
    {
      role: 'system',
      content: `You are an expert social media copywriter. For the following X (Twitter) post${niche && niche !== 'General' ? ` from a user in the **${niche}** niche` : ''}${goal ? ` whose primary goal is **${goal}**` : ''}, create three improved versions that:
      1. Sound more natural, friendly, and engaging
      2. Simplify the language so it's easy to read
      3. Make it feel like a conversation
      4. Focus on making the message feel relatable and warm
      5. Keep spacing
      6. Use one emoji and no hashtags
      7. For each suggestion, provide:
         - Engagement score (0-100)
         - Friendliness score (0-100)
         - Virality score (0-100)
         - Advanced analytics (same as analyze.ts)

      **IMPORTANT: Each suggestion MUST aim for significantly higher engagement, friendliness, and virality scores compared to the original post's likely performance. The scores you assign must reflect this improvement.**

      Respond *only* in this JSON format. The root object must contain a single key "suggestions", which is an array containing **exactly three** suggestion objects:
      {
        "suggestions": [
          {
            "text": string,
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
          }
        ]
      }

      Tailor the suggestions and their scores/analytics based on the specified niche and goal where relevant. Ensure the suggestions are genuine improvements focused on achieving higher scores.`,
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

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    return response.suggestions;
  } catch (error) {
    console.error('Error getting suggestions:', error);
    throw error;
  }
}
