export interface CreatorStyle {
  tone: string[];
  commonTopics: string[];
  postLength: {
    min: number;
    max: number;
  };
  emojiUsage: boolean;
  hashtagUsage: boolean;
  callToAction: boolean;
}

export interface DefaultCreator {
  username: string;
  name: string;
  description: string;
  style: CreatorStyle;
}

export const defaultCreators: DefaultCreator[] = [
  {
    username: 'tibo_maker',
    name: 'Thibault Louis-Lucas',
    description: 'Building in public, sharing startup journey and growth insights',
    style: {
      tone: ['casual', 'transparent', 'educational'],
      commonTopics: ['startup growth', 'product development', 'user feedback'],
      postLength: { min: 100, max: 280 },
      emojiUsage: true,
      hashtagUsage: true,
      callToAction: true,
    },
  },
  {
    username: 'marc_louvion',
    name: 'Marc Lou',
    description: 'SaaS founder sharing growth strategies and business insights',
    style: {
      tone: ['professional', 'data-driven', 'strategic'],
      commonTopics: ['SaaS metrics', 'growth strategies', 'business insights'],
      postLength: { min: 150, max: 280 },
      emojiUsage: false,
      hashtagUsage: false,
      callToAction: true,
    },
  },
  {
    username: 'levelsio',
    name: 'Pieter Levels',
    description: 'Indie maker sharing product launches and revenue numbers',
    style: {
      tone: ['direct', 'transparent', 'minimalist'],
      commonTopics: ['product launches', 'revenue updates', 'indie hacking'],
      postLength: { min: 50, max: 200 },
      emojiUsage: false,
      hashtagUsage: false,
      callToAction: false,
    },
  },
  {
    username: 'arvidkahl',
    name: 'Arvid Kahl',
    description: 'Indie hacker sharing bootstrapping and audience building',
    style: {
      tone: ['analytical', 'educational', 'personal'],
      commonTopics: ['bootstrapping', 'audience building', 'product marketing'],
      postLength: { min: 200, max: 280 },
      emojiUsage: false,
      hashtagUsage: false,
      callToAction: true,
    },
  },
  {
    username: 'dannypostmaa',
    name: 'Danny Postma',
    description: 'Product maker sharing development and growth insights',
    style: {
      tone: ['enthusiastic', 'technical', 'practical'],
      commonTopics: ['product development', 'growth hacks', 'technical insights'],
      postLength: { min: 100, max: 280 },
      emojiUsage: true,
      hashtagUsage: true,
      callToAction: true,
    },
  },
];
