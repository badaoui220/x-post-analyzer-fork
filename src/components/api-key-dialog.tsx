'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';

interface ApiKeyDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function ApiKeyDialog({ open, onClose, onSave }: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    if (!apiKey.trim()) return;
    Cookies.set('openai-api-key', apiKey, { expires: 30 }); // Store for 30 days
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
      <DialogContent className="border border-[#333] bg-[#1a1a1a] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Enter OpenAI API Key</DialogTitle>
          <DialogDescription className="text-gray-400">
            To analyze posts, you need to provide your OpenAI API key. Your key will be stored
            securely in your browser.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full border-none bg-[#2a2a2a] text-white placeholder:text-white/30"
            />
            <p className="text-xs text-white/40">
              Your API key will be stored securely in your browser.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="cursor-pointer text-white/60 hover:bg-white/10 hover:text-white"
            >
              Save API Key
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
