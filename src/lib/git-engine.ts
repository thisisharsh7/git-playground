/**
 * Git command simulator, extracted verbatim from src/app/git-playground/page.tsx.
 *
 * Phase 3 is a mechanical move: every existing defect is preserved deliberately
 * so the Phase 2 characterization tests pass unmodified. Fixes land in Phase 4.
 * Known defects kept intact here: D1.1 shallow copy, D1.3 branch-filtered log,
 * D1.4/D1.5 flags read as branch names, D1.6 bare `git` prints undefined,
 * D1.7 missing args succeed silently, D1.8 no -m required, D1.9 status never
 * settles, D1.10 non-hex commit ids, D1.11 single-space argument split.
 */

export interface GitState {
  currentBranch: string;
  branches: string[];
  commits: Array<{
    id: string;
    message: string;
    author: string;
    timestamp: string;
    branch: string;
  }>;
  workingDirectory: string[];
  stagingArea: string[];
  remotes: string[];
  status: string;
}

export interface CommandHistory {
  command: string;
  output: string;
  timestamp: string;
  success: boolean;
}

export interface CommandResult {
  state: GitState;
  output: string;
  success: boolean;
}

export interface EngineDeps {
  now?: () => string;
  nextId?: () => string;
  formatTimestamp?: (timestamp: string) => string;
}

// Factories, not shared constants: the engine mutates the state it is given
// (D1.1), so a module-level object would leak between mounts.
export const createInitialGitState = (): GitState => ({
  currentBranch: 'main',
  branches: ['main'],
  commits: [
    {
      id: 'a1b2c3d',
      message: 'Initial commit',
      author: 'Developer',
      timestamp: '2024-01-01T12:00:00.000Z', // Fixed timestamp
      branch: 'main'
    }
  ],
  workingDirectory: ['README.md', 'index.html'],
  stagingArea: [],
  remotes: [],
  status: 'clean'
});

export const createInitialCommandHistory = (): CommandHistory[] => ([
  {
    command: 'git init',
    output: 'Initialized empty Git repository in /project/.git/',
    timestamp: '2024-01-01T12:00:00.000Z', // Fixed timestamp
    success: true
  }
]);

export function generateStatusOutput(state: GitState): string {
  let output = `On branch ${state.currentBranch}\n`;

  if (state.stagingArea.length > 0) {
    output += '\nChanges to be committed:\n';
    output += '  (use "git reset HEAD <file>..." to unstage)\n\n';
    state.stagingArea.forEach(file => {
      output += `\tmodified:   ${file}\n`;
    });
  }

  const unstagedFiles = state.workingDirectory.filter(f => !state.stagingArea.includes(f));
  if (unstagedFiles.length > 0) {
    output += '\nChanges not staged for commit:\n';
    output += '  (use "git add <file>..." to update what will be committed)\n\n';
    unstagedFiles.forEach(file => {
      output += `\tmodified:   ${file}\n`;
    });
  }

  if (state.stagingArea.length === 0 && unstagedFiles.length === 0) {
    output += 'nothing to commit, working tree clean';
  }

  return output;
}

const defaultNow = () => new Date().toISOString();

// Fixed-length lowercase hex, so ids look like real abbreviated object names.
// Previously Math.random().toString(36).substr(2, 7) produced variable-length
// values containing g-z, which are not valid in a SHA (D1.10) — and the value
// is used as a React key, so collisions produced duplicate keys.
const defaultNextId = () => {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('').slice(0, 7);
};
const defaultFormatTimestamp = (timestamp: string) => new Date(timestamp).toLocaleString();

/**
 * Extracts the message from `git commit -m ...`.
 * Returns null when -m is absent, or the message (possibly empty) when present.
 * Handles "double quoted", 'single quoted' and a single bare token.
 */
function parseCommitMessage(input: string): string | null {
  const match = input.match(/\s-m(?:\s+|=)("([^"]*)"|'([^']*)'|(\S+))/);
  if (!match) return input.match(/\s-m(\s*)$/) ? '' : null;
  return match[2] ?? match[3] ?? match[4] ?? '';
}

export function executeGitCommand(
  state: GitState,
  input: string,
  deps: EngineDeps = {}
): CommandResult | null {
  const trimmedCmd = input.trim();
  if (!trimmedCmd) return null;

  const now = deps.now ?? defaultNow;
  const nextId = deps.nextId ?? defaultNextId;
  const formatTimestamp = deps.formatTimestamp ?? defaultFormatTimestamp;

  let output = '';
  let success = true;
  const newGitState = { ...state };

  // Split on runs of whitespace. Splitting on a single space meant any repeated
  // space produced an empty token, so `git  status` reported an empty
  // subcommand and every command broke (D1.11). Commit messages are parsed from
  // the raw input, so collapsing whitespace here does not affect them.
  const parts = trimmedCmd.split(/\s+/);
  const gitCommand = parts[1];

  // Bare `git` used to fall through to the default branch, which interpolated
  // the undefined subcommand and printed "git: 'undefined' is not a git
  // command." (D1.6). Matched on the whole input, not on a falsy parts[1], so
  // that `git  status` still reports an empty subcommand (D1.11, unfixed).
  if (trimmedCmd === 'git') {
    return {
      state: newGitState,
      output:
        'usage: git <command> [<args>]\n\n' +
        'Supported commands: add, branch, checkout, commit, log, remote, status',
      success: false,
    };
  }

  switch (gitCommand) {
    case 'status':
      output = generateStatusOutput(newGitState);
      break;
    case 'add':
      if (parts[2] === '.') {
        newGitState.stagingArea = [...newGitState.workingDirectory];
        output = 'Added all files to staging area';
      } else if (parts[2]) {
        if (newGitState.workingDirectory.includes(parts[2])) {
          if (!newGitState.stagingArea.includes(parts[2])) {
            newGitState.stagingArea.push(parts[2]);
          }
          output = `Added ${parts[2]} to staging area`;
        } else {
          output = `fatal: pathspec '${parts[2]}' did not match any files`;
          success = false;
        }
      } else {
        // Previously fell through with empty output and success: true (D1.7).
        output = "Nothing specified, nothing added.\nhint: Maybe you wanted to say 'git add .'?";
        success = false;
      }
      break;
    case 'commit': {
      // Parsed from the raw input, not from whitespace-split tokens, so quoted
      // messages keep their internal spacing and apostrophes survive. The old
      // code joined tokens and stripped every quote character, which turned
      // "it's fine" into "its fine", and never required -m at all (D1.8).
      const message = parseCommitMessage(trimmedCmd);
      if (message === null) {
        output = 'usage: git commit -m <message>';
        success = false;
      } else if (message === '') {
        output = 'Aborting commit due to empty commit message.';
        success = false;
      } else if (newGitState.stagingArea.length > 0) {
        const newCommit = {
          id: nextId(),
          message,
          author: 'Developer',
          timestamp: now(),
          branch: newGitState.currentBranch
        };
        newGitState.commits.push(newCommit);
        newGitState.stagingArea = [];
        output = `[${newGitState.currentBranch} ${newCommit.id}] ${newCommit.message}`;
      } else {
        output = 'nothing to commit, working tree clean';
        success = false;
      }
      break;
    }
    case 'branch': {
      const arg = parts[2];
      if (arg === '-d' || arg === '-D') {
        const target = parts[3];
        if (!target) {
          output = 'fatal: branch name required';
          success = false;
        } else if (!newGitState.branches.includes(target)) {
          output = `error: branch '${target}' not found.`;
          success = false;
        } else if (target === newGitState.currentBranch) {
          output = `error: Cannot delete branch '${target}' checked out at '/project'`;
          success = false;
        } else {
          const tip = [...newGitState.commits].reverse()
            .find(c => c.branch === target) ?? newGitState.commits[newGitState.commits.length - 1];
          newGitState.branches = newGitState.branches.filter(b => b !== target);
          output = `Deleted branch ${target} (was ${tip.id}).`;
        }
      } else if (arg && arg.startsWith('-')) {
        // Previously any flag became a branch name, so `git branch -d x`
        // created a branch called '-d' (D1.5).
        output = `error: unknown switch \`${arg}'`;
        success = false;
      } else if (arg) {
        if (!newGitState.branches.includes(arg)) {
          newGitState.branches.push(arg);
          output = `Created branch '${arg}'`;
        } else {
          output = `fatal: A branch named '${arg}' already exists.`;
          success = false;
        }
      } else {
        output = newGitState.branches.map(b =>
          b === newGitState.currentBranch ? `* ${b}` : `  ${b}`
        ).join('\n');
      }
      break;
    }
    case 'checkout': {
      const arg = parts[2];
      if (arg === '-b') {
        // Previously '-b' was looked up as a branch name, so the most common
        // branching command always failed (D1.4).
        const target = parts[3];
        if (!target) {
          output = 'fatal: branch name required';
          success = false;
        } else if (newGitState.branches.includes(target)) {
          output = `fatal: a branch named '${target}' already exists`;
          success = false;
        } else {
          newGitState.branches.push(target);
          newGitState.currentBranch = target;
          output = `Switched to a new branch '${target}'`;
        }
      } else if (arg && arg.startsWith('-')) {
        output = `error: unknown switch \`${arg}'`;
        success = false;
      } else if (arg && newGitState.branches.includes(arg)) {
        newGitState.currentBranch = arg;
        output = `Switched to branch '${arg}'`;
      } else if (arg) {
        output = `error: pathspec '${arg}' did not match any file(s) known to git`;
        success = false;
      } else {
        // Previously fell through with empty output and success: true (D1.7).
        output = 'usage: git checkout <branch>';
        success = false;
      }
      break;
    }
    case 'log':
      output = newGitState.commits
        .filter(c => c.branch === newGitState.currentBranch)
        .reverse()
        .map(c => `commit ${c.id}\nAuthor: ${c.author}\nDate: ${formatTimestamp(c.timestamp)}\n\n    ${c.message}\n`)
        .join('\n');
      break;
    case 'remote': {
      const sub = parts[2];
      if (sub === 'add') {
        if (parts[3] && parts[4]) {
          newGitState.remotes.push(`${parts[3]} -> ${parts[4]}`);
          output = `Added remote '${parts[3]}'`;
        } else {
          // Previously fell through silently when the URL was missing (D1.7).
          output = 'usage: git remote add <name> <url>';
          success = false;
        }
      } else if (sub === '-v') {
        output = newGitState.remotes.join('\n') || 'No remotes configured';
      } else if (!sub) {
        // Bare `git remote` lists remote names. Empty output with success is
        // correct here: that is what real git does with no remotes configured.
        output = newGitState.remotes.map(r => r.split(' -> ')[0]).join('\n');
      } else {
        output = `error: Unknown subcommand: ${sub}`;
        success = false;
      }
      break;
    }
    default:
      if (trimmedCmd.startsWith('git')) {
        output = `git: '${gitCommand}' is not a git command. See 'git --help'.`;
        success = false;
      } else {
        output = `bash: ${trimmedCmd}: command not found`;
        success = false;
      }
  }

  return { state: newGitState, output, success };
}
