'use client';

import React, { useState } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import styles from './PromptInput.module.css';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function PromptInput({ onSubmit, isLoading, disabled }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading && !disabled) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to draw... (e.g., 'a sunset over mountains')"
          className={styles.input}
          disabled={isLoading || disabled}
        />
      </div>
      <button
        type="submit"
        className={styles.button}
        disabled={!prompt.trim() || isLoading || disabled}
      >
        {isLoading ? (
          <>
            <Loader2 size={14} className={styles.spinner} />
            <span>Thinking...</span>
          </>
        ) : (
          <>
            <Wand2 size={14} />
            <span>Paint it!</span>
          </>
        )}
      </button>
    </form>
  );
}
