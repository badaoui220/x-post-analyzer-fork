'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import Cookies from 'js-cookie';

export function ApiKeyForm() {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const storedKey = Cookies.get('openai-api-key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);

    if (value.trim()) {
      Cookies.set('openai-api-key', value, { expires: 7 });
    } else {
      Cookies.remove('openai-api-key');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2">
      <span className="text-xs text-white/60">Add your OpenAI API Key</span>
      <Input
        type="password"
        placeholder="API Key"
        value={apiKey}
        onChange={handleChange}
        className="h-8 w-64 border-white/10 bg-transparent text-sm text-white/90 placeholder:text-white/30"
      />
    </motion.div>
  );
}
