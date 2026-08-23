'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  createInitialCommandHistory,
  createInitialGitState,
  executeGitCommand,
  type CommandHistory,
  type GitState,
} from '@/lib/git-engine';

/**
 * Owns the playground's mutable state. Extracted verbatim from
 * src/app/git-playground/page.tsx; the 300ms delay and the render-closure read
 * of gitState (D1.2) are preserved deliberately. Fixes land in Phase 4.
 */
export function useGitRepo() {
  const [gitState, setGitState] = useState<GitState>(() => createInitialGitState());
  const [command, setCommand] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>(() =>
    createInitialCommandHistory()
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Safe timestamp formatting for SSR
  const formatTimestamp = useCallback((timestamp: string): string => {
    if (!isClient) return 'Loading...';
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  }, [isClient]);

  const runCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setIsTyping(true);

    // Simulate typing delay for better UX
    setTimeout(() => {
      const result = executeGitCommand(gitState, trimmedCmd, { formatTimestamp });
      if (!result) {
        setIsTyping(false);
        return;
      }

      setCommandHistory(prev => [...prev, {
        command: trimmedCmd,
        output: result.output,
        timestamp: new Date().toISOString(),
        success: result.success,
      }]);
      setGitState(result.state);
      setCommand('');
      setIsTyping(false);
    }, 300); // Reduced delay for better responsiveness
  };

  return {
    gitState,
    commandHistory,
    command,
    setCommand,
    isTyping,
    isClient,
    formatTimestamp,
    runCommand,
  };
}
