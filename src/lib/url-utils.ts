/**
 * Utility functions for generating URLs with specific tab parameters
 */

export type TabType = 'playground' | 'lessons' | 'commands' | 'visualization';

export interface GitPlaygroundUrlOptions {
  tab?: TabType;
  search?: string;
  lesson?: string;
  command?: string;
}

/**
 * Generate a URL for the Git playground with specific parameters
 */
export function createGitPlaygroundUrl(options: GitPlaygroundUrlOptions = {}): string {
  const baseUrl = '/git-playground';
  const params = new URLSearchParams();

  // Set tab parameter
  if (options.tab) {
    params.set('tab', options.tab);
  }

  // Set search parameter for commands tab
  if (options.search) {
    params.set('search', options.search);
  }

  // Set specific command search
  if (options.command) {
    params.set('tab', 'commands');
    params.set('search', options.command);
  }

  // Set specific lesson
  if (options.lesson) {
    params.set('tab', 'lessons');
    params.set('lesson', options.lesson);
  }

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Quick URL generators for specific tabs
 */
export const gitPlaygroundUrls = {
  playground: () => createGitPlaygroundUrl({ tab: 'playground' }),
  lessons: (lesson?: string) => createGitPlaygroundUrl({ tab: 'lessons', lesson }),
  commands: (search?: string) => createGitPlaygroundUrl({ tab: 'commands', search }),
  visualization: () => createGitPlaygroundUrl({ tab: 'visualization' }),
  
  // Specific command shortcuts
  gitAdd: () => createGitPlaygroundUrl({ command: 'add' }),
  gitCommit: () => createGitPlaygroundUrl({ command: 'commit' }),
  gitPush: () => createGitPlaygroundUrl({ command: 'push' }),
  gitPull: () => createGitPlaygroundUrl({ command: 'pull' }),
  gitBranch: () => createGitPlaygroundUrl({ command: 'branch' }),
  gitMerge: () => createGitPlaygroundUrl({ command: 'merge' }),
  gitRebase: () => createGitPlaygroundUrl({ command: 'rebase' }),
  gitStatus: () => createGitPlaygroundUrl({ command: 'status' }),
  gitLog: () => createGitPlaygroundUrl({ command: 'log' }),
  gitDiff: () => createGitPlaygroundUrl({ command: 'diff' }),
};

/**
 * Parse URL parameters to extract tab and search information
 */
export function parseGitPlaygroundUrl(url: string): GitPlaygroundUrlOptions {
  try {
    const urlObj = new URL(url, 'http://localhost');
    const params = urlObj.searchParams;
    
    return {
      tab: (params.get('tab') as TabType) || undefined,
      search: params.get('search') || undefined,
      lesson: params.get('lesson') || undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Validate if a tab parameter is valid
 */
export function isValidTab(tab: string): tab is TabType {
  return ['playground', 'lessons', 'commands', 'visualization'].includes(tab);
}

/**
 * Get the default tab if none is specified or if invalid
 */
export function getDefaultTab(tab?: string): TabType {
  return isValidTab(tab || '') ? (tab as TabType) : 'playground';
}
