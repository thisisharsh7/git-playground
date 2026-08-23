'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitLessons } from "@/components/git-lessons";
import { GitCommands } from "@/components/git-commands";
import { GitVisualization } from "@/components/git-visualization";
import { GitPlayground } from "@/components/playground/git-playground";
import { Terminal, Play, BookOpen, Command, BarChart3, CheckCircle } from 'lucide-react';

function GitPlaygroundContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get URL parameters
  const tabParam = searchParams.get('tab');
  const searchQuery = searchParams.get('search') || '';
  const lessonQuery = searchParams.get('lesson') || '';

  // Validate and set initial tab
  const validTabs = ['playground', 'lessons', 'commands', 'visualization'];
  const initialTab = tabParam && validTabs.includes(tabParam) ? tabParam : 'playground';

  const [selectedSection, setSelectedSection] = useState(initialTab);

  // Update URL when tab changes
  const updateURL = useCallback((tab: string, search?: string, lesson?: string) => {
    const params = new URLSearchParams();
    params.set('tab', tab);
    if (search && search.trim()) {
      params.set('search', search);
    }
    if (lesson && lesson.trim()) {
      params.set('lesson', lesson);
    }
    const newURL = `${pathname}?${params.toString()}`;
    router.replace(newURL, { scroll: false });
  }, [pathname, router]);

  // Handle tab changes
  const handleTabChange = useCallback((tab: string) => {
    setSelectedSection(tab);
    updateURL(tab, searchQuery);
  }, [updateURL, searchQuery]);

  // The lessonId used to be logged and thrown away, so every "practice this"
  // button landed on the generic lesson list (D1.13).
  const handleNavigateToLesson = useCallback((lessonId: string) => {
    setSelectedSection('lessons');
    updateURL('lessons', undefined, lessonId);
  }, [updateURL]);

  // Sync with URL parameters on mount and when they change
  useEffect(() => {
    const validTabs = ['playground', 'lessons', 'commands', 'visualization'];
    const currentTab = searchParams.get('tab');
    const validTab = currentTab && validTabs.includes(currentTab) ? currentTab : 'playground';

    if (validTab !== selectedSection) {
      setSelectedSection(validTab);
    }
  }, [searchParams, selectedSection]);

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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text py-1.5 text-transparent mb-2.5">
              Git Playground
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
              Master Git commands through interactive practice with real-time feedback and beautiful visualizations
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                <Terminal className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Live Terminal</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Visual Feedback</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Safe Environment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Component with Sticky Navigation */}
      <Tabs value={selectedSection} onValueChange={handleTabChange} className="w-full">
        {/* Sticky Tab Navigation */}
        <div className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md ">
          <div className="max-w-7xl mx-auto">
            <TabsList className="grid w-full px-2 sm:px-3 lg:px-8 xl:px-6 grid-cols-4 h-14 bg-slate-100/50 dark:bg-slate-800/50 border-0 rounded-none">
              <TabsTrigger
                value="playground"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white dark:data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-blue-600 dark:data-[state=active]:to-purple-600 dark:data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Playground</span>
                <span className="sm:hidden font-medium">Play</span>
              </TabsTrigger>
              <TabsTrigger
                value="lessons"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white dark:data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-green-600 dark:data-[state=active]:to-emerald-600 dark:data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Lessons</span>
                <span className="sm:hidden font-medium">Learn</span>
              </TabsTrigger>
              <TabsTrigger
                value="commands"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white dark:data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-orange-600 dark:data-[state=active]:to-amber-600 dark:data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Command className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Commands</span>
                <span className="sm:hidden font-medium">Cmd</span>
              </TabsTrigger>
              <TabsTrigger
                value="visualization"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white dark:data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-purple-600 dark:data-[state=active]:to-pink-600 dark:data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Visualization</span>
                <span className="sm:hidden font-medium">Visual</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 w-full max-w-full">
          <TabsContent value="playground" className="space-y-8 mt-0">
            <GitPlayground />
          </TabsContent>

          <TabsContent value="lessons" className="mt-0">
            <GitLessons initialLessonId={lessonQuery} />
          </TabsContent>

          <TabsContent value="commands" className="mt-0">
            <GitCommands initialSearch={searchQuery} />
          </TabsContent>

          <TabsContent value="visualization" className="mt-0">
            <GitVisualization onNavigateToLesson={handleNavigateToLesson} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default function GitPlaygroundPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading Git Playground...</p>
        </div>
      </div>
    }>
      <GitPlaygroundContent />
    </Suspense>
  );
}
