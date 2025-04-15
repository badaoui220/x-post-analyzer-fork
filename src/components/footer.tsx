'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export function Footer() {
  return (
    <motion.footer
      className="monospace w-full py-6"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-white/60">
            Powered by{' '}
            <Link
              href="https://x.com/audiencon"
              target="_blank"
              className="underline transition-colors hover:text-white"
            >
              Audiencon
            </Link>{' '}
            - 100% free
          </div>
          <div className="flex items-center gap-6 text-sm text-white/60">
            <Link
              href="https://animstats.com"
              className="underline transition-colors hover:text-white"
              target="_blank"
            >
              AnimStats
            </Link>
            <Link
              href="https://helpkoder.com"
              className="underline transition-colors hover:text-white"
              target="_blank"
            >
              HelpKoder
            </Link>
            <Link
              href="https://audiencon.beehiiv.com"
              className="underline transition-colors hover:text-white"
              target="_blank"
            >
              Newsletter
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
