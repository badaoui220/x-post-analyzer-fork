'use client';

import { useState } from 'react';
import { ApiKeyDialog } from './api-key-dialog';

export function ApiKeyDialogWrapper() {
  const [open, setOpen] = useState(true);

  return <ApiKeyDialog open={open} onClose={() => setOpen(false)} onSave={() => setOpen(false)} />;
}
