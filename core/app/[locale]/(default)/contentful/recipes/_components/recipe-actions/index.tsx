'use client';

import { Mail, Printer } from 'lucide-react';

interface RecipeActionsProps {
  recipeName: string;
}

export function RecipeActions({ recipeName }: RecipeActionsProps) {
  const handleEmailShare = () => {
    const subject = encodeURIComponent(recipeName);
    const body = encodeURIComponent(window.location.href);

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="mb-8 flex justify-center space-x-6">
      <button
        aria-label="Share via Email"
        className="text-contrast-500 hover:text-foreground transition"
        onClick={handleEmailShare}
        type="button"
      >
        <Mail size={20} />
      </button>
      <button
        aria-label="Print recipe"
        className="text-contrast-500 hover:text-foreground transition"
        onClick={handlePrint}
        type="button"
      >
        <Printer size={20} />
      </button>
    </div>
  );
}
