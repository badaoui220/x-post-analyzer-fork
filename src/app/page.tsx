'use client';

import { motion } from 'framer-motion';
import { AnalyzeForm } from '@/components/analyze/analyze-form';
import { ApiKeyDialog } from '@/components/api-key-dialog';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for API key only after component is mounted
    if (!Cookies.get('openai-api-key')) {
      setShowApiKeyDialog(true);
    }
  }, []);

  const handleApiKeySave = () => {
    setShowApiKeyDialog(false);
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-8">
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="mx-auto max-w-6xl space-y-8"
      >
        <AnalyzeForm />
      </motion.div>
      {mounted && (
        <ApiKeyDialog
          open={showApiKeyDialog}
          onClose={() => setShowApiKeyDialog(false)}
          onSave={handleApiKeySave}
        />
      )}
    </main>
  );
}
