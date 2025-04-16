'use server';

import OpenAI from 'openai';
import Cookies from 'js-cookie';
import { DEFAULT_MODEL } from '@/config/openai';
import creatorsData from '@/data/creators.json';

interface Tweet {
  text: string;
  metrics: {
    likes: number;
    comments: number;
    reposts: number;
    impressions: number;
  };
}

export interface RewrittenPost {
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

export async function rewritePost(
  content: string,
  username: string,
  apiKey: string
): Promise<RewrittenPost> {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  try {
    // Get creator data from the local creators array
    const creator = creatorsData.creators.find(c => c.handle.replace('@', '') === username);
    if (!creator) {
      throw new Error(`Creator ${username} not found`);
    }

    const recentTweets = creator.recentTweets.slice(0, 5);
    const openai = new OpenAI({ apiKey });
    const model = Cookies.get('openai-model') || DEFAULT_MODEL;

    // Analyze the user's writing style
    const styleAnalysis = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: `Analyze the following tweets and identify the key characteristics of ${username}'s writing style. Focus on:
          1. Tone and voice
          2. Common phrases or patterns
          3. Emoji usage (one max)
          4. Hashtag usage (no hashtag)
          5. Post length
          6. Engagement strategies
          7. Writing style (casual, formal, humorous, etc.)
          8. Common topics or themes
          9. Call-to-action patterns
          10. Sentence structure and complexity`,
        },
        {
          role: 'user',
          content: recentTweets.map((tweet: Tweet) => tweet.text).join('\n\n'),
        },
      ],
      temperature: 0.7,
    });

    // Rewrite the content in the user's style
    const rewrittenContent = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: `Rewrite the following content in ${username}'s style. Use the style analysis provided.

          Respond in this JSON format:
          {
            "text": string,
            "scores": {
              "engagement": number,
              "friendliness": number,
              "virality": number
            }
          }`,
        },
        {
          role: 'user',
          content: `Style Analysis:\n${styleAnalysis.choices[0].message.content}\n\nContent to rewrite:\n${content}`,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    // Calculate average engagement metrics
    const avgMetrics = recentTweets.reduce(
      (
        acc: { likes: number; comments: number; reposts: number; impressions: number },
        tweet: Tweet
      ) => {
        acc.likes += tweet.metrics.likes;
        acc.comments += tweet.metrics.comments;
        acc.reposts += tweet.metrics.reposts;
        acc.impressions += tweet.metrics.impressions;
        return acc;
      },
      { likes: 0, comments: 0, reposts: 0, impressions: 0 }
    );

    const totalTweets = recentTweets.length;
    const predictedMetrics = {
      likes: Math.round(avgMetrics.likes / totalTweets),
      comments: Math.round(avgMetrics.comments / totalTweets),
      reposts: Math.round(avgMetrics.reposts / totalTweets),
      impressions: Math.round(avgMetrics.impressions / totalTweets),
    };

    const responseData = JSON.parse(rewrittenContent.choices[0].message.content || '{}');
    if (!responseData.text) {
      throw new Error('Failed to generate rewritten content');
    }

    return {
      text: responseData.text,
      scores: responseData.scores,
      metrics: predictedMetrics,
    };
  } catch (error) {
    console.error('Error rewriting post:', error);
    throw error;
  }
}
