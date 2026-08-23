'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitLessons } from "@/components/git-lessons";
import { GitCommands } from "@/components/git-commands";
import { GitVisualization } from "@/components/git-visualization";
import { GitPlayground } from "@/components/playground/git-playground";
import { Play, BookOpen, Command, BarChart3 } from 'lucide-react';

const VALID_TABS = ['playground', 'lessons', 'commands', 'visualization'] as const;
type Tab = (typeof VALID_TABS)[number];

const isValidTab = (tab: string | null): tab is Tab =>
  tab !== null && (VALID_TABS as readonly string[]).includes(tab);

interface UrlState {
  tab: Tab;
  search: string;
  lesson: string;
}

/**
 * Reads `?tab=`, `?search=` and `?lesson=` and reports them upward.
 *
 * This is the only place that touches useSearchParams, and it renders nothing.
 * useSearchParams opts a static route out of prerendering, so keeping it in a
 * null-rendering leaf behind its own Suspense boundary means only this leaf is
 * deferred — the hero, the tab bar and the default tab's content all still
 * prerender into the HTML. Previously the hook sat at the top of the page, so
 * the whole route prerendered as the loading spinner and nothing was crawlable.
 */
function UrlStateReader({ onRead }: { onRead: (state: UrlState) => void }) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const search = searchParams.get('search') ?? '';
  const lesson = searchParams.get('lesson') ?? '';
  const tab: Tab = isValidTab(tabParam) ? tabParam : 'playground';

  useEffect(() => {
    onRead({ tab, search, lesson });
  }, [onRead, tab, search, lesson]);

  return null;
}

export function PlaygroundTabs() {
  // Defaults render on the server; UrlStateReader corrects them after hydration.
  const [selectedSection, setSelectedSection] = useState<Tab>('playground');
  const [searchQuery, setSearchQuery] = useState('');
  const [lessonQuery, setLessonQuery] = useState('');

  const router = useRouter();
  const pathname = usePathname();

  const handleUrlState = useCallback((state: UrlState) => {
    setSelectedSection(state.tab);
    setSearchQuery(state.search);
    setLessonQuery(state.lesson);
  }, []);

  const updateURL = useCallback((tab: string, search?: string, lesson?: string) => {
    const params = new URLSearchParams();
    params.set('tab', tab);
    if (search && search.trim()) {
      params.set('search', search);
    }
    if (lesson && lesson.trim()) {
      params.set('lesson', lesson);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router]);

  const handleTabChange = useCallback((tab: string) => {
    if (!isValidTab(tab)) return;
    setSelectedSection(tab);
    updateURL(tab, searchQuery);
  }, [updateURL, searchQuery]);

  const handleNavigateToLesson = useCallback((lessonId: string) => {
    setSelectedSection('lessons');
    setLessonQuery(lessonId);
    updateURL('lessons', undefined, lessonId);
  }, [updateURL]);

  return (
    <>
      <Suspense fallback={null}>
        <UrlStateReader onRead={handleUrlState} />
      </Suspense>

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
            <GitPlayground headingLevel={3} />
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
    </>
  );
}
