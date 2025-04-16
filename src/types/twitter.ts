export interface Tweet {
  id: string;
  text: string;
  created_at?: string;
  public_metrics?: {
    like_count: number;
    reply_count: number;
    retweet_count: number;
    impression_count: number;
  };
}

export interface CreatorWithPosts {
  id: string;
  username: string;
  name: string;
  avatar: string;
  topPosts: Array<{
    id: string;
    text: string;
    createdAt: string;
    metrics: {
      likes: number;
      replies: number;
      retweets: number;
      impressions: number;
    };
  }>;
}
