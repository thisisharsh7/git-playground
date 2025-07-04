export interface GitCommandExplanation {
  command: string;
  shortDescription: string;
  detailedExplanation: string;
  useCase: string;
  example: string;
  category: 'basic' | 'branching' | 'remote' | 'history' | 'advanced' | 'collaboration' | 'maintenance';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  relatedCommands: string[];
  commonFlags: Array<{
    flag: string;
    description: string;
  }>;
}

export const gitCommandExplanations: Record<string, GitCommandExplanation> = {
  // BASIC COMMANDS
  'git init': {
    command: 'git init',
    shortDescription: 'Initialize a new Git repository in the current directory.',
    detailedExplanation: 'Creates a new Git repository by setting up the necessary .git directory structure. This is the first command you run when starting version control for a project.',
    useCase: 'Starting a new project or adding version control to an existing project.',
    example: 'git init my-project',
    category: 'basic',
    difficulty: 'beginner',
    relatedCommands: ['git clone', 'git status'],
    commonFlags: [
      { flag: '--bare', description: 'Create a bare repository (no working directory)' },
      { flag: '--initial-branch=<name>', description: 'Set the initial branch name' }
    ]
  },

  'git clone': {
    command: 'git clone',
    shortDescription: 'Create a local copy of a remote repository.',
    detailedExplanation: 'Downloads a complete copy of a remote repository, including all files, branches, and commit history. Sets up the remote connection automatically.',
    useCase: 'Getting a copy of an existing project to work on locally.',
    example: 'git clone https://github.com/user/repo.git',
    category: 'basic',
    difficulty: 'beginner',
    relatedCommands: ['git init', 'git remote', 'git fetch'],
    commonFlags: [
      { flag: '--depth <depth>', description: 'Create a shallow clone with limited history' },
      { flag: '--branch <name>', description: 'Clone a specific branch' },
      { flag: '--single-branch', description: 'Clone only one branch' }
    ]
  },

  'git status': {
    command: 'git status',
    shortDescription: 'Show the current state of your working directory and staging area.',
    detailedExplanation: 'Displays which files are modified, staged for commit, or untracked. Essential for understanding what changes you have before committing.',
    useCase: 'Checking what changes you have made before committing.',
    example: 'git status --short',
    category: 'basic',
    difficulty: 'beginner',
    relatedCommands: ['git add', 'git commit', 'git diff'],
    commonFlags: [
      { flag: '--short', description: 'Show status in short format' },
      { flag: '--porcelain', description: 'Machine-readable output' },
      { flag: '--ignored', description: 'Show ignored files too' }
    ]
  },

  'git add': {
    command: 'git add',
    shortDescription: 'Stage changes for the next commit.',
    detailedExplanation: 'Moves changes from your working directory to the staging area, preparing them to be included in the next commit. You can stage specific files or all changes.',
    useCase: 'Selecting which changes to include in your next commit.',
    example: 'git add . (stage all changes)',
    category: 'basic',
    difficulty: 'beginner',
    relatedCommands: ['git commit', 'git status', 'git reset'],
    commonFlags: [
      { flag: '.', description: 'Stage all changes in current directory' },
      { flag: '-A', description: 'Stage all changes including deletions' },
      { flag: '-p', description: 'Interactively stage parts of files' }
    ]
  },

  'git commit': {
    command: 'git commit',
    shortDescription: 'Save staged changes to the repository with a descriptive message.',
    detailedExplanation: 'Creates a permanent snapshot of your staged changes with a commit message. Each commit represents a point in your project\'s history.',
    useCase: 'Saving your work with a description of what you changed.',
    example: 'git commit -m "Add user authentication feature"',
    category: 'basic',
    difficulty: 'beginner',
    relatedCommands: ['git add', 'git push', 'git log'],
    commonFlags: [
      { flag: '-m <message>', description: 'Add commit message inline' },
      { flag: '-a', description: 'Stage and commit all tracked files' },
      { flag: '--amend', description: 'Modify the last commit' }
    ]
  },

  // BRANCHING COMMANDS
  'git branch': {
    command: 'git branch',
    shortDescription: 'List, create, or delete branches in your repository.',
    detailedExplanation: 'Manages branches in your repository. Without arguments, lists all branches. Can create new branches or delete existing ones.',
    useCase: 'Managing different lines of development in your project.',
    example: 'git branch feature-login',
    category: 'branching',
    difficulty: 'beginner',
    relatedCommands: ['git checkout', 'git merge', 'git switch'],
    commonFlags: [
      { flag: '-a', description: 'List all branches (local and remote)' },
      { flag: '-d <branch>', description: 'Delete a branch' },
      { flag: '-m <old> <new>', description: 'Rename a branch' }
    ]
  },

  'git checkout': {
    command: 'git checkout',
    shortDescription: 'Switch between branches or restore files to a previous state.',
    detailedExplanation: 'Multi-purpose command that can switch branches, create new branches, or restore files. Updates your working directory to match the target branch or commit.',
    useCase: 'Switching between different features or restoring files.',
    example: 'git checkout main',
    category: 'branching',
    difficulty: 'beginner',
    relatedCommands: ['git branch', 'git switch', 'git restore'],
    commonFlags: [
      { flag: '-b <branch>', description: 'Create and switch to new branch' },
      { flag: '--', description: 'Restore files instead of switching branches' },
      { flag: '-f', description: 'Force checkout, discarding local changes' }
    ]
  },

  'git switch': {
    command: 'git switch',
    shortDescription: 'Switch between branches (newer alternative to checkout).',
    detailedExplanation: 'Modern command specifically for switching branches. Clearer and safer than checkout for branch operations.',
    useCase: 'Moving between different branches in your project.',
    example: 'git switch feature-branch',
    category: 'branching',
    difficulty: 'beginner',
    relatedCommands: ['git checkout', 'git branch', 'git restore'],
    commonFlags: [
      { flag: '-c <branch>', description: 'Create and switch to new branch' },
      { flag: '-d', description: 'Detach HEAD at current commit' },
      { flag: '--guess', description: 'Try to match remote branch names' }
    ]
  },

  'git merge': {
    command: 'git merge',
    shortDescription: 'Combine changes from one branch into your current branch.',
    detailedExplanation: 'Integrates changes from another branch into your current branch. Creates a merge commit that combines the histories of both branches.',
    useCase: 'Bringing completed features into your main branch.',
    example: 'git merge feature-branch',
    category: 'branching',
    difficulty: 'intermediate',
    relatedCommands: ['git rebase', 'git branch', 'git log'],
    commonFlags: [
      { flag: '--no-ff', description: 'Always create a merge commit' },
      { flag: '--squash', description: 'Combine all commits into one' },
      { flag: '--abort', description: 'Cancel an ongoing merge' }
    ]
  },

  // REMOTE COMMANDS
  'git remote': {
    command: 'git remote',
    shortDescription: 'Manage connections to remote repositories.',
    detailedExplanation: 'Configure and manage remote repository connections. Remotes are aliases for repository URLs that make it easier to push and pull changes.',
    useCase: 'Setting up connections to GitHub, GitLab, or other remote repositories.',
    example: 'git remote add origin https://github.com/user/repo.git',
    category: 'remote',
    difficulty: 'beginner',
    relatedCommands: ['git push', 'git pull', 'git fetch'],
    commonFlags: [
      { flag: '-v', description: 'Show remote URLs' },
      { flag: 'add <name> <url>', description: 'Add a new remote' },
      { flag: 'remove <name>', description: 'Remove a remote' }
    ]
  },

  'git push': {
    command: 'git push',
    shortDescription: 'Upload your local commits to a remote repository.',
    detailedExplanation: 'Sends your local commits to a remote repository, making them available to other collaborators. Updates the remote branch with your changes.',
    useCase: 'Sharing your work with others or backing up to a remote server.',
    example: 'git push origin main',
    category: 'remote',
    difficulty: 'beginner',
    relatedCommands: ['git pull', 'git commit', 'git remote'],
    commonFlags: [
      { flag: '-u', description: 'Set upstream tracking for the branch' },
      { flag: '--force', description: 'Force push (dangerous, overwrites remote)' },
      { flag: '--tags', description: 'Push tags along with commits' }
    ]
  },

  'git pull': {
    command: 'git pull',
    shortDescription: 'Download and merge changes from a remote repository.',
    detailedExplanation: 'Combines git fetch and git merge in one command. Downloads new commits from remote and merges them into your current branch.',
    useCase: 'Getting the latest changes from your team before starting work.',
    example: 'git pull origin main',
    category: 'remote',
    difficulty: 'beginner',
    relatedCommands: ['git fetch', 'git merge', 'git push'],
    commonFlags: [
      { flag: '--rebase', description: 'Rebase instead of merge' },
      { flag: '--no-commit', description: 'Don\'t auto-commit the merge' },
      { flag: '--ff-only', description: 'Only allow fast-forward merges' }
    ]
  },

  'git fetch': {
    command: 'git fetch',
    shortDescription: 'Download changes from remote without merging them.',
    detailedExplanation: 'Retrieves new commits, branches, and tags from remote repository but doesn\'t merge them into your working branch. Safer than pull.',
    useCase: 'Checking what changes are available before merging them.',
    example: 'git fetch origin',
    category: 'remote',
    difficulty: 'intermediate',
    relatedCommands: ['git pull', 'git merge', 'git log'],
    commonFlags: [
      { flag: '--all', description: 'Fetch from all remotes' },
      { flag: '--prune', description: 'Remove remote-tracking branches that no longer exist' },
      { flag: '--tags', description: 'Fetch all tags' }
    ]
  },

  // HISTORY COMMANDS
  'git log': {
    command: 'git log',
    shortDescription: 'Show the commit history of your repository.',
    detailedExplanation: 'Displays a chronological list of commits with their messages, authors, dates, and commit hashes. Essential for understanding project history.',
    useCase: 'Reviewing what changes have been made and by whom.',
    example: 'git log --oneline --graph',
    category: 'history',
    difficulty: 'beginner',
    relatedCommands: ['git show', 'git diff', 'git blame'],
    commonFlags: [
      { flag: '--oneline', description: 'Show each commit on one line' },
      { flag: '--graph', description: 'Show branch and merge history graphically' },
      { flag: '--since="2 weeks ago"', description: 'Show commits from specific time period' }
    ]
  },

  'git show': {
    command: 'git show',
    shortDescription: 'Display detailed information about a specific commit.',
    detailedExplanation: 'Shows the full details of a commit including the diff of changes made. Can also show information about tags and other Git objects.',
    useCase: 'Examining exactly what changes were made in a specific commit.',
    example: 'git show HEAD~1',
    category: 'history',
    difficulty: 'beginner',
    relatedCommands: ['git log', 'git diff', 'git blame'],
    commonFlags: [
      { flag: '--stat', description: 'Show file change statistics' },
      { flag: '--name-only', description: 'Show only names of changed files' },
      { flag: '--pretty=format:', description: 'Custom output format' }
    ]
  },

  'git diff': {
    command: 'git diff',
    shortDescription: 'Show differences between commits, branches, or files.',
    detailedExplanation: 'Compares different versions of files and shows exactly what lines were added, removed, or modified. Very useful for reviewing changes.',
    useCase: 'Seeing what changes you\'ve made before committing.',
    example: 'git diff HEAD~1 HEAD',
    category: 'history',
    difficulty: 'beginner',
    relatedCommands: ['git status', 'git show', 'git log'],
    commonFlags: [
      { flag: '--staged', description: 'Show differences of staged files' },
      { flag: '--name-only', description: 'Show only file names' },
      { flag: '--word-diff', description: 'Show word-level differences' }
    ]
  },

  // ADVANCED COMMANDS
  'git rebase': {
    command: 'git rebase',
    shortDescription: 'Reapply commits from one branch onto another, creating a linear history.',
    detailedExplanation: 'Moves or combines commits from one branch to another, rewriting commit history to create a cleaner, linear progression.',
    useCase: 'Cleaning up commit history before merging or updating feature branches.',
    example: 'git rebase main',
    category: 'advanced',
    difficulty: 'advanced',
    relatedCommands: ['git merge', 'git cherry-pick', 'git reset'],
    commonFlags: [
      { flag: '-i', description: 'Interactive rebase to edit commits' },
      { flag: '--onto <branch>', description: 'Rebase onto a different branch' },
      { flag: '--abort', description: 'Cancel an ongoing rebase' }
    ]
  },

  'git cherry-pick': {
    command: 'git cherry-pick',
    shortDescription: 'Apply a specific commit from another branch onto your current branch.',
    detailedExplanation: 'Copies a commit from one branch and applies it to your current branch, creating a new commit with the same changes but different hash.',
    useCase: 'Applying a specific bug fix or feature from another branch.',
    example: 'git cherry-pick abc123',
    category: 'advanced',
    difficulty: 'advanced',
    relatedCommands: ['git rebase', 'git merge', 'git revert'],
    commonFlags: [
      { flag: '-n', description: 'Don\'t auto-commit the cherry-pick' },
      { flag: '-x', description: 'Add reference to original commit' },
      { flag: '--continue', description: 'Continue after resolving conflicts' }
    ]
  },

  'git stash': {
    command: 'git stash',
    shortDescription: 'Temporarily save uncommitted changes without creating a commit.',
    detailedExplanation: 'Stores your current changes in a temporary area, allowing you to switch branches or pull updates without committing incomplete work.',
    useCase: 'Quickly switching contexts while preserving work in progress.',
    example: 'git stash push -m "Work in progress on login"',
    category: 'advanced',
    difficulty: 'intermediate',
    relatedCommands: ['git commit', 'git reset', 'git checkout'],
    commonFlags: [
      { flag: 'pop', description: 'Apply and remove the most recent stash' },
      { flag: 'list', description: 'Show all stashes' },
      { flag: 'drop', description: 'Delete a stash without applying it' }
    ]
  },

  'git reset': {
    command: 'git reset',
    shortDescription: 'Undo commits or unstage files by moving the HEAD pointer.',
    detailedExplanation: 'Powerful command that can undo commits, unstage files, or completely reset your repository to a previous state. Use with caution.',
    useCase: 'Undoing commits or unstaging files before committing.',
    example: 'git reset --soft HEAD~1',
    category: 'advanced',
    difficulty: 'advanced',
    relatedCommands: ['git revert', 'git checkout', 'git add'],
    commonFlags: [
      { flag: '--soft', description: 'Keep changes staged' },
      { flag: '--mixed', description: 'Keep changes but unstage them' },
      { flag: '--hard', description: 'Discard all changes (dangerous)' }
    ]
  },

  'git revert': {
    command: 'git revert',
    shortDescription: 'Create a new commit that undoes changes from a previous commit.',
    detailedExplanation: 'Safely undoes a commit by creating a new commit with the opposite changes. Preserves history unlike reset.',
    useCase: 'Undoing a commit that has already been shared with others.',
    example: 'git revert HEAD~1',
    category: 'advanced',
    difficulty: 'intermediate',
    relatedCommands: ['git reset', 'git cherry-pick', 'git log'],
    commonFlags: [
      { flag: '-n', description: 'Don\'t auto-commit the revert' },
      { flag: '--mainline <parent>', description: 'Specify parent for merge commits' },
      { flag: '--no-edit', description: 'Don\'t open editor for commit message' }
    ]
  },

  // COLLABORATION COMMANDS
  'git blame': {
    command: 'git blame',
    shortDescription: 'Show who last modified each line of a file and when.',
    detailedExplanation: 'Annotates each line of a file with the commit hash, author, and date of the last modification. Useful for understanding code history.',
    useCase: 'Finding out who wrote or last changed specific lines of code.',
    example: 'git blame src/main.js',
    category: 'collaboration',
    difficulty: 'intermediate',
    relatedCommands: ['git log', 'git show', 'git diff'],
    commonFlags: [
      { flag: '-L <start>,<end>', description: 'Blame only specific lines' },
      { flag: '-w', description: 'Ignore whitespace changes' },
      { flag: '--since=<date>', description: 'Show changes since specific date' }
    ]
  },

  'git tag': {
    command: 'git tag',
    shortDescription: 'Create, list, or delete tags to mark specific points in history.',
    detailedExplanation: 'Tags are used to mark specific commits, typically for releases or important milestones. Unlike branches, tags don\'t move.',
    useCase: 'Marking release versions or important milestones in your project.',
    example: 'git tag v1.0.0',
    category: 'collaboration',
    difficulty: 'intermediate',
    relatedCommands: ['git push', 'git log', 'git show'],
    commonFlags: [
      { flag: '-a', description: 'Create annotated tag with message' },
      { flag: '-d <tag>', description: 'Delete a tag' },
      { flag: '-l', description: 'List all tags' }
    ]
  },

  // MAINTENANCE COMMANDS
  'git clean': {
    command: 'git clean',
    shortDescription: 'Remove untracked files from your working directory.',
    detailedExplanation: 'Deletes files that are not tracked by Git. Useful for cleaning up build artifacts or temporary files.',
    useCase: 'Cleaning up your workspace by removing unwanted files.',
    example: 'git clean -fd',
    category: 'maintenance',
    difficulty: 'intermediate',
    relatedCommands: ['git status', 'git reset', 'git checkout'],
    commonFlags: [
      { flag: '-f', description: 'Force removal of files' },
      { flag: '-d', description: 'Remove directories too' },
      { flag: '-n', description: 'Dry run - show what would be deleted' }
    ]
  },

  'git gc': {
    command: 'git gc',
    shortDescription: 'Clean up and optimize your Git repository.',
    detailedExplanation: 'Garbage collection command that optimizes repository storage by compressing files and removing unnecessary data.',
    useCase: 'Optimizing repository performance and reducing disk usage.',
    example: 'git gc --aggressive',
    category: 'maintenance',
    difficulty: 'advanced',
    relatedCommands: ['git fsck', 'git prune', 'git repack'],
    commonFlags: [
      { flag: '--aggressive', description: 'More thorough optimization' },
      { flag: '--auto', description: 'Only run if needed' },
      { flag: '--prune=<date>', description: 'Prune objects older than date' }
    ]
  }
};

// Cache for instant responses
const explanationCache = new Map<string, GitCommandExplanation>();

// Initialize cache
Object.entries(gitCommandExplanations).forEach(([key, value]) => {
  explanationCache.set(key.toLowerCase(), value);
  // Also cache without 'git ' prefix
  const commandOnly = key.replace('git ', '');
  explanationCache.set(commandOnly.toLowerCase(), value);
});

export class GitExplainer {
  static explain(command: string): GitCommandExplanation | null {
    const normalizedCommand = command.toLowerCase().trim();
    
    // Try exact match first
    let explanation = explanationCache.get(normalizedCommand);
    
    // Try with 'git ' prefix if not found
    if (!explanation && !normalizedCommand.startsWith('git ')) {
      explanation = explanationCache.get(`git ${normalizedCommand}`);
    }
    
    // Try without 'git ' prefix if not found
    if (!explanation && normalizedCommand.startsWith('git ')) {
      explanation = explanationCache.get(normalizedCommand.replace('git ', ''));
    }
    
    return explanation || null;
  }

  static getCommandsByCategory(category: GitCommandExplanation['category']): GitCommandExplanation[] {
    return Object.values(gitCommandExplanations).filter(cmd => cmd.category === category);
  }

  static getCommandsByDifficulty(difficulty: GitCommandExplanation['difficulty']): GitCommandExplanation[] {
    return Object.values(gitCommandExplanations).filter(cmd => cmd.difficulty === difficulty);
  }

  static searchCommands(query: string): GitCommandExplanation[] {
    const searchTerm = query.toLowerCase();
    return Object.values(gitCommandExplanations).filter(cmd => 
      cmd.command.toLowerCase().includes(searchTerm) ||
      cmd.shortDescription.toLowerCase().includes(searchTerm) ||
      cmd.detailedExplanation.toLowerCase().includes(searchTerm) ||
      cmd.useCase.toLowerCase().includes(searchTerm)
    );
  }

  static getAllCommands(): GitCommandExplanation[] {
    return Object.values(gitCommandExplanations);
  }

  static getRandomTip(): GitCommandExplanation {
    const commands = Object.values(gitCommandExplanations);
    return commands[Math.floor(Math.random() * commands.length)];
  }
}
