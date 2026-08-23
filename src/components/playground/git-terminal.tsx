'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Terminal, Play } from 'lucide-react';
import type { CommandHistory } from '@/lib/git-engine';

interface GitTerminalProps {
  history: CommandHistory[];
  currentBranch: string;
  command: string;
  isTyping: boolean;
  isClient: boolean;
  terminalRef: RefObject<HTMLDivElement | null>;
  onCommandChange: (value: string) => void;
  onExecute: () => void;
}

// Markup moved verbatim from git-playground/page.tsx:374-468. The deprecated
// onKeyPress handler is preserved on purpose; it becomes onKeyDown in Phase 4.
export function GitTerminal({
  history,
  currentBranch,
  command,
  isTyping,
  isClient,
  terminalRef,
  onCommandChange,
  onExecute,
}: GitTerminalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const wasTyping = useRef(false);

  // Return focus to the prompt once a command finishes, so a click on a quick
  // command does not leave focus stranded on the button (D1.14).
  useEffect(() => {
    if (wasTyping.current && !isTyping) {
      inputRef.current?.focus();
    }
    wasTyping.current = isTyping;
  }, [isTyping]);

  return (
    <Card className="overflow-hidden border-0  shadow-2xl bg-white/50 dark:bg-slate-900/50 py-0 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <Terminal className="w-5 h-5 text-green-400" />
            <CardTitle className="text-lg font-bold text-green-400">
              git-playground
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>LIVE</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div
          ref={terminalRef}
          className="h-96 bg-slate-900 text-green-400 p-4 font-mono text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
        >
          {history.map((cmd, index) => (
            <div key={index} className="mb-3 group">
              <div className="flex items-center gap-2 text-blue-400 break-all">
                <span className="text-green-400 font-bold">➜</span>
                <span className="text-cyan-400 font-medium">git-playground</span>
                <span className="text-blue-400">git:(</span>
                <span className="text-yellow-400 font-medium">{currentBranch}</span>
                <span className="text-blue-400">)</span>
                <span className="text-white font-bold">$</span>
                <span className="text-white">{cmd.command}</span>
              </div>
              <div className={`${cmd.success ? 'text-green-300' : 'text-red-400'} whitespace-pre-wrap break-words ml-4 mt-1 opacity-90 leading-relaxed`}>
                {cmd.output}
              </div>
            </div>
          ))}

          {/* Current prompt */}
          <div className="flex items-center gap-2 text-blue-400">
            <span className="text-green-400 font-bold">➜</span>
            <span className="text-cyan-400 font-medium">git-playground</span>
            <span className="text-blue-400">git:(</span>
            <span className="text-yellow-400 font-medium">{currentBranch}</span>
            <span className="text-blue-400">)</span>
            <span className="text-white font-bold">$</span>
            {isClient && isTyping && (
              <span className="text-yellow-400 animate-pulse font-medium">Processing...</span>
            )}
            {isClient && !isTyping && (
              <span className="w-2 h-4 bg-green-400 animate-pulse ml-1"></span>
            )}
          </div>
        </div>

        {/* Command Input */}
        <div className="p-4 bg-slate-800 border-t border-slate-700">
          <div className="flex gap-3">
            <div className="flex items-center gap-2 text-green-400 font-mono text-sm font-bold">
              <span>$</span>
            </div>
            {/* Deliberately not disabled while a command runs: disabling blurs
                the element and dropped focus to <body> after every command
                (D1.14). Enter is still ignored mid-command. */}
            <Input
              ref={inputRef}
              value={command}
              onChange={(e) => onCommandChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isTyping && onExecute()}
              placeholder="Type your Git command here..."
              className="font-mono bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400/20"
            />
            <Button
              onClick={onExecute}
              disabled={isTyping || !command.trim()}
              className="px-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isClient && isTyping ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Running</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  <span>Execute</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
