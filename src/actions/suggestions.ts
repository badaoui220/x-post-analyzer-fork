/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import OpenAI from 'openai';
import type { AdvancedAnalytics } from './analyze';

export interface Suggestion {
  text: string;
  scores: {
    engagement: number;
    friendliness: number;
    virality: number;
  };
  analytics: AdvancedAnalytics;
}

export async function getSuggestions(content: string, apiKey: string): Promise<Suggestion[]> {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  const openai = new OpenAI({ apiKey });

  const messages = [
    {
      role: 'system',
      content: `Create three improved versions of this X (Twitter) post that:
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
      
      Respond in this JSON format:
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

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    return response.suggestions;
  } catch (error) {
    console.error('Error getting suggestions:', error);
    throw error;
  }
}
