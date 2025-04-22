/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import type { InspirationExample } from '@/actions/inspiration';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Copy, MessageSquareReply, Repeat2, Heart, BarChart2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface InspirationCardProps {
  example: InspirationExample;
  onSelect: (text: string) => void;
}

const formatNumber = (num: number | undefined): string => {
  if (num === undefined || num === null) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'K';
  return num.toString();
};

// Helper to format the date string (e.g., "Apr 22")
const formatTweetDate = (dateString: string | undefined): string | null => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return null; // Return null on error
  }
};

// Helper to replace URLs in text
const renderTextWithLinksHidden = (text: string): string => {
  // Simple regex to find URLs (http/https)
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  // Replace URLs with [link hidden] - you could also just remove them ('')
  return text.replace(urlRegex, '[link hidden]');
};

const extractLink = (text: string): string | null => {
  const urlRegex = /https:\/\/t\.co\/[^\s]+/;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
};

export function InspirationCard({ example, onSelect }: InspirationCardProps) {
  const handleSelect = () => {
    onSelect(example.text);
  };

  const formattedDate = formatTweetDate(example.createdAt);

  return (
    <div className="flex gap-3 rounded-lg border border-white/10 bg-[#111111] p-4 transition-colors hover:bg-[#1a1a1a]">
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage src={example.userAvatarUrl} alt={example.userName ?? 'User avatar'} />
        <AvatarFallback>
          {example.userName
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase() || '??'}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 overflow-hidden">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-x-1.5 gap-y-0 text-[15px]">
          <div className="flex items-center gap-x-1.5">
            <span className="cursor-pointer truncate font-bold text-white hover:underline">
              {example.userName || 'Unknown User'}
            </span>
            {example.userVerified && (
              <svg className="h-4 w-4 text-[#1d9bf0]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
              </svg>
            )}
            <span className="truncate text-white/60">@{example.userHandle || 'unknownhandle'}</span>
          </div>
          {extractLink(example.text) && (
            <Link href={extractLink(example.text) as string} target="_blank">
              <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>

        <p className="mb-3 text-[15px] leading-relaxed whitespace-pre-wrap text-white/90">
          {renderTextWithLinksHidden(example.text)}
        </p>

        {example.mediaUrl && example.mediaType === 'photo' && (
          <div className="my-3 overflow-hidden rounded-lg border border-white/10">
            <img
              src={example.mediaUrl}
              alt="Tweet media"
              className="aspect-video w-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div className="border-b border-white/30 py-2 text-xs text-white/60">
          {formattedDate || ''}
        </div>

        <div className="flex max-w-md items-center justify-between text-xs text-white/60">
          <div className="group flex cursor-pointer items-center gap-1 hover:text-[#1d9bf0]">
            <MessageSquareReply className="h-4 w-4 rounded-full p-0.5 group-hover:bg-[#1d9bf0]/10" />
            <span>{formatNumber(example.metrics?.reply_count)}</span>
          </div>

          <div className="group flex cursor-pointer items-center gap-1 hover:text-green-500">
            <Repeat2 className="h-4 w-4 rounded-full p-0.5 group-hover:bg-green-500/10" />
            <span>{formatNumber(example.metrics?.retweet_count)}</span>
          </div>

          <div className="group flex cursor-pointer items-center gap-1 hover:text-pink-500">
            <Heart className="h-4 w-4 rounded-full p-0.5 group-hover:bg-pink-500/10" />
            <span>{formatNumber(example.metrics?.like_count)}</span>
          </div>

          <div className="group flex cursor-pointer items-center gap-1 hover:text-[#1d9bf0]">
            <BarChart2 className="h-4 w-4 rounded-full p-0.5 group-hover:bg-[#1d9bf0]/10" />
            <span>{formatNumber(example.metrics?.impression_count)}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white/50 hover:bg-white/10 hover:text-white"
            onClick={handleSelect}
            aria-label="Select example text"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
