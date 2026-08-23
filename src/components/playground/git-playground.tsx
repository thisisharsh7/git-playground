'use client';

import { useEffect, useRef } from 'react';
import { useGitRepo } from '@/hooks/use-git-repo';
import { GitTerminal } from '@/components/playground/git-terminal';
import { RepositoryState } from '@/components/playground/repository-state';
import { QuickCommands } from '@/components/playground/quick-commands';

/**
 * Self-contained playground: terminal + repository state + quick commands.
 *
 * MUST NOT import useSearchParams, useRouter or usePathname. Tab and URL
 * concerns belong to the route file. That constraint is what lets this
 * component prerender into static HTML — exactly what /git-playground lost by
 * putting useSearchParams inside its Suspense boundary. Enforced by a test.
 */
/**
 * Heading level for the playground's card titles. The component sits under an
 * `h1` on /git-playground and will sit under an `h2` on the homepage, so the
 * level has to move with it or the document skips a level.
 */
export type HeadingLevel = 2 | 3;

interface GitPlaygroundProps {
  headingLevel?: HeadingLevel;
}

export function GitPlayground({ headingLevel = 2 }: GitPlaygroundProps = {}) {
  const {
    gitState,
    commandHistory,
    command,
    setCommand,
    isTyping,
    isClient,
    formatTimestamp,
    runCommand,
  } = useGitRepo();

  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GitTerminal
          history={commandHistory}
          currentBranch={gitState.currentBranch}
          command={command}
          isTyping={isTyping}
          isClient={isClient}
          terminalRef={terminalRef}
          onCommandChange={setCommand}
          onExecute={() => runCommand(command)}
          headingLevel={headingLevel}
        />
        <RepositoryState
          state={gitState}
          formatTimestamp={formatTimestamp}
          headingLevel={headingLevel}
        />
      </div>

      <QuickCommands
        onExecute={runCommand}
        disabled={isTyping}
        headingLevel={headingLevel}
      />
    </>
  );
}
