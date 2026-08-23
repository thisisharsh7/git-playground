'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, FileText, Clock, CheckCircle } from 'lucide-react';
import type { GitState } from '@/lib/git-engine';
import type { HeadingLevel } from '@/components/playground/git-playground';

interface RepositoryStateProps {
  state: GitState;
  formatTimestamp: (timestamp: string) => string;
  headingLevel?: HeadingLevel;
}

// Markup moved verbatim from git-playground/page.tsx:471-573.
export function RepositoryState({ state, formatTimestamp, headingLevel = 2 }: RepositoryStateProps) {
  const Heading = `h${headingLevel}` as const;
  const SubHeading = `h${headingLevel + 1}` as 'h3' | 'h4';

  return (
    <Card className="overflow-hidden border-0 shadow-2xl bg-white/50 dark:bg-slate-900/50  py-0 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
        <div className="flex items-center gap-3">
          <GitBranch className="w-6 h-6" />
          <div>
            <CardTitle className="text-lg font-bold"><Heading>Repository State</Heading></CardTitle>
            <CardDescription className="text-purple-100">
              Live visualization of your Git repository
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 space-y-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">

        {/* Current Branch */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <SubHeading className="font-semibold text-slate-900 dark:text-slate-100">Current Branch</SubHeading>
          </div>
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 text-sm font-medium shadow-lg">
            {state.currentBranch}
          </Badge>
        </div>

        {/* All Branches */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-green-600 dark:text-green-400" />
            <SubHeading className="font-semibold text-slate-900 dark:text-slate-100">All Branches</SubHeading>
          </div>
          <div className="flex flex-wrap gap-2">
            {state.branches.map(branch => (
              <Badge
                key={branch}
                variant={branch === state.currentBranch ? "default" : "secondary"}
                className={`px-3 py-1 text-sm ${branch === state.currentBranch
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
              >
                {branch === state.currentBranch ? "★ " : ""}{branch}
              </Badge>
            ))}
          </div>
        </div>

        {/* Working Directory */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <SubHeading className="font-semibold text-slate-900 dark:text-slate-100">Working Directory</SubHeading>
          </div>
          <div className="space-y-2">
            {state.workingDirectory.map(file => (
              <div key={file} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span className="font-mono text-sm text-slate-700 dark:text-slate-300">{file}</span>
                </div>
                {state.stagingArea.includes(file) && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs px-2 py-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Staged
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Commits */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <SubHeading className="font-semibold text-slate-900 dark:text-slate-100">Recent Commits</SubHeading>
          </div>
          <div className="space-y-3">
            {state.commits.slice(-3).reverse().map((commit, index) => (
              <div key={commit.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-xs font-mono bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                    {commit.id}
                  </code>
                  {index === 0 && (
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs px-2 py-0.5">
                      HEAD
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-1">
                  {commit.message}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatTimestamp(commit.timestamp)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
