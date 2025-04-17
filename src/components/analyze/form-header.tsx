'use client';

import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 },
};

export function FormHeader() {
  return (
    <motion.div key="header" {...fadeIn} className="relative mb-8 space-y-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto mb-8 h-16 w-16"
      >
        <div className="bg-primary/20 absolute inset-0 rounded-2xl blur-xl" />
        <div className="relative rounded-2xl bg-white p-4 shadow-lg">
          <span className="text-2xl font-bold text-black">𝕏</span>
        </div>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-4 text-4xl font-bold tracking-tight md:text-6xl"
      >
        𝕏 Post Roast
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground mx-auto max-w-2xl text-xl"
      >
        Get AI-powered insights to improve your posts&apos; engagement and reach
      </motion.p>
    </motion.div>
  );
}
