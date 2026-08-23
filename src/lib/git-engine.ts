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
const defaultNextId = () => Math.random().toString(36).substr(2, 7);
const defaultFormatTimestamp = (timestamp: string) => new Date(timestamp).toLocaleString();

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

  // Parse and execute Git commands
  const parts = trimmedCmd.split(' ');
  const gitCommand = parts[1];

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
      }
      break;
    case 'commit':
      if (newGitState.stagingArea.length > 0) {
        const message = parts.slice(3).join(' ') || 'Commit message';
        const newCommit = {
          id: nextId(),
          message: message.replace(/['"]/g, ''),
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
    case 'branch':
      if (parts[2]) {
        if (!newGitState.branches.includes(parts[2])) {
          newGitState.branches.push(parts[2]);
          output = `Created branch '${parts[2]}'`;
        } else {
          output = `fatal: A branch named '${parts[2]}' already exists.`;
          success = false;
        }
      } else {
        output = newGitState.branches.map(b =>
          b === newGitState.currentBranch ? `* ${b}` : `  ${b}`
        ).join('\n');
      }
      break;
    case 'checkout':
      if (parts[2] && newGitState.branches.includes(parts[2])) {
        newGitState.currentBranch = parts[2];
        output = `Switched to branch '${parts[2]}'`;
      } else if (parts[2]) {
        output = `error: pathspec '${parts[2]}' did not match any file(s) known to git`;
        success = false;
      }
      break;
    case 'log':
      output = newGitState.commits
        .filter(c => c.branch === newGitState.currentBranch)
        .reverse()
        .map(c => `commit ${c.id}\nAuthor: ${c.author}\nDate: ${formatTimestamp(c.timestamp)}\n\n    ${c.message}\n`)
        .join('\n');
      break;
    case 'remote':
      if (parts[2] === 'add' && parts[3] && parts[4]) {
        newGitState.remotes.push(`${parts[3]} -> ${parts[4]}`);
        output = `Added remote '${parts[3]}'`;
      } else if (parts[2] === '-v') {
        output = newGitState.remotes.join('\n') || 'No remotes configured';
      }
      break;
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
