'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Command, BarChart3, GitBranch, CheckCircle, Clock } from 'lucide-react';

import type { HeadingLevel } from '@/components/playground/git-playground';

interface QuickCommandsProps {
  onExecute: (command: string) => void;
  disabled: boolean;
  headingLevel?: HeadingLevel;
}

// Markup and command list moved verbatim from git-playground/page.tsx:577-637.
// Note `git checkout feature` fails unless `git branch feature` ran first.
export function QuickCommands({ onExecute, disabled, headingLevel = 2 }: QuickCommandsProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <Card className="overflow-hidden border-0 shadow-2xl bg-white/50 dark:bg-slate-900/50 pt-0 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4">
        <div className="flex items-center gap-3">
          <Command className="w-6 h-6" />
          <div>
            <CardTitle className="text-lg font-bold"><Heading>Quick Commands</Heading></CardTitle>
            <CardDescription className="text-cyan-100">
              Click to execute common Git commands instantly
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { cmd: 'git status', label: 'Status', icon: BarChart3, color: 'from-green-500 to-emerald-500' },
            { cmd: 'git add .', label: 'Add All', icon: CheckCircle, color: 'from-blue-500 to-cyan-500' },
            { cmd: 'git commit -m "Update files"', label: 'Commit', icon: CheckCircle, color: 'from-purple-500 to-violet-500' },
            { cmd: 'git log', label: 'Log', icon: Clock, color: 'from-orange-500 to-amber-500' },
            { cmd: 'git branch', label: 'Branches', icon: GitBranch, color: 'from-teal-500 to-cyan-500' },
            { cmd: 'git branch feature', label: 'New Branch', icon: GitBranch, color: 'from-pink-500 to-rose-500' },
            { cmd: 'git checkout feature', label: 'Checkout', icon: GitBranch, color: 'from-indigo-500 to-purple-500' },
            { cmd: 'git remote -v', label: 'Remotes', icon: GitBranch, color: 'from-slate-500 to-gray-500' },
          ].map((item, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => onExecute(item.cmd)}
              disabled={disabled}
              className={`h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-r ${item.color} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          ))}
        </div>

        {/* Command Categories */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              <BarChart3 className="w-3 h-3 mr-1" />
              Status & Info
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              <CheckCircle className="w-3 h-3 mr-1" />
              Staging & Commits
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              <GitBranch className="w-3 h-3 mr-1" />
              Branching
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
              <GitBranch className="w-3 h-3 mr-1" />
              Remote
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
