'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="monospace w-full py-6">
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
              href="https://www.synapy.app"
              className="underline transition-colors hover:text-white"
              target="_blank"
            >
              Synapt
            </Link>
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
    </footer>
  );
}
