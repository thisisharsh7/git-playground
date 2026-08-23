import { PlaygroundTabs } from "@/components/playground/playground-tabs";
import { SUPPORTED_COMMANDS } from "@/lib/git-engine";
import { Terminal, BookOpen, BarChart3, Info } from 'lucide-react';

// Server component. The hero, the intro and the default tab's content all
// prerender into the HTML; only the query-string reader is deferred.
export default function GitPlaygroundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" suppressHydrationWarning>

      {/* Modern Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-pink-500/5 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-4.5">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Terminal className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-2.5">
              Git Playground
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              A browser-based workspace for learning Git. Practise commands in a simulated
              repository, work through lessons with quizzes, and look up what each command does.
            </p>

            {/* What the workspace contains */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto text-left">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                <h2 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                  <Terminal className="w-4 h-4 text-green-600 dark:text-green-400" />
                  Command practice
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Type Git commands and watch the branch, staging area and commit history change.
                </p>
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                <h2 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Lessons and quizzes
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Four guided lessons, from the basics to rebasing, each ending in a short quiz.
                </p>
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                <h2 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                  <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  Reference and diagrams
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Look up any documented command, and see how branching and merging fit together.
                </p>
              </div>
            </div>

            {/* Honest scope. The verb list comes from the engine itself, so it
                cannot drift from what the terminal really runs. */}
            <div className="mt-6 max-w-4xl mx-auto text-left bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/70 dark:border-amber-800/50 rounded-xl p-4">
              <h2 className="flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-300">
                <Info className="w-4 h-4" />
                What the simulator does and does not do
              </h2>
              <p className="mt-1 text-sm text-amber-900/90 dark:text-amber-200/90">
                The terminal runs {SUPPORTED_COMMANDS.map(c => `git ${c}`).join(', ')} against an
                in-memory repository. Other commands are explained in the reference but are not
                executable here, and nothing you type can affect a real repository or your machine.
              </p>
            </div>
          </div>
        </div>
      </div>

      <PlaygroundTabs />
    </div>
  );
}
