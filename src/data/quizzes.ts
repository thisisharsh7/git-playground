import { Quiz } from '@/components/quiz';

export const quizzes: Quiz[] = [
  {
    id: 'git-basics-quiz',
    lessonId: 'git-basics',
    title: 'Git Basics Quiz',
    description: 'Test your understanding of fundamental Git concepts',
    passingScore: 70,
    timeLimit: 10,
    questions: [
      {
        id: 'q1',
        question: 'What is Git primarily used for?',
        type: 'multiple-choice',
        options: [
          'Creating websites',
          'Version control and tracking changes in files',
          'Database management',
          'Image editing'
        ],
        correctAnswer: 1,
        explanation: 'Git is a distributed version control system designed to track changes in files and coordinate work among multiple people.',
        difficulty: 'easy'
      },
      {
        id: 'q2',
        question: 'Which command initializes a new Git repository?',
        type: 'multiple-choice',
        options: [
          'git start',
          'git create',
          'git init',
          'git new'
        ],
        correctAnswer: 2,
        explanation: 'The "git init" command creates a new Git repository in the current directory by creating a .git folder.',
        difficulty: 'easy'
      },
      {
        id: 'q3',
        question: 'The staging area is where you prepare files before committing them.',
        type: 'true-false',
        correctAnswer: true,
        explanation: 'The staging area (also called the index) is where you place files that you want to include in your next commit.',
        difficulty: 'easy'
      },
      {
        id: 'q4',
        question: 'Which command shows the current status of your working directory?',
        type: 'multiple-choice',
        options: [
          'git check',
          'git status',
          'git info',
          'git state'
        ],
        correctAnswer: 1,
        explanation: 'The "git status" command displays the state of the working directory and staging area.',
        difficulty: 'easy'
      },
      {
        id: 'q5',
        question: 'What does "git add ." do?',
        type: 'multiple-choice',
        options: [
          'Adds only new files to staging',
          'Adds all changes in the current directory to staging',
          'Commits all changes',
          'Creates a new branch'
        ],
        correctAnswer: 1,
        explanation: 'The "git add ." command stages all changes (new, modified, and deleted files) in the current directory and subdirectories.',
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'branching-quiz',
    lessonId: 'branching',
    title: 'Branching & Merging Quiz',
    description: 'Test your knowledge of Git branches and merging',
    passingScore: 75,
    timeLimit: 12,
    questions: [
      {
        id: 'q1',
        question: 'What is a Git branch?',
        type: 'multiple-choice',
        options: [
          'A copy of your entire project',
          'A lightweight movable pointer to a specific commit',
          'A backup of your files',
          'A different Git repository'
        ],
        correctAnswer: 1,
        explanation: 'A Git branch is essentially a lightweight movable pointer to a specific commit, allowing you to work on different features simultaneously.',
        difficulty: 'medium'
      },
      {
        id: 'q2',
        question: 'Which command creates a new branch called "feature"?',
        type: 'multiple-choice',
        options: [
          'git new feature',
          'git branch feature',
          'git create feature',
          'git make feature'
        ],
        correctAnswer: 1,
        explanation: 'The "git branch feature" command creates a new branch named "feature" but doesn\'t switch to it.',
        difficulty: 'easy'
      },
      {
        id: 'q3',
        question: 'You can work on multiple branches simultaneously without affecting each other.',
        type: 'true-false',
        correctAnswer: true,
        explanation: 'Branches allow you to work on different features or experiments in isolation without affecting the main codebase or other branches.',
        difficulty: 'easy'
      },
      {
        id: 'q4',
        question: 'Which command switches to an existing branch called "develop"?',
        type: 'multiple-choice',
        options: [
          'git switch develop',
          'git checkout develop',
          'git change develop',
          'Both A and B are correct'
        ],
        correctAnswer: 3,
        explanation: 'Both "git switch develop" and "git checkout develop" can be used to switch to an existing branch. "git switch" is the newer, more intuitive command.',
        difficulty: 'medium'
      },
      {
        id: 'q5',
        question: 'What happens when you merge a branch?',
        type: 'multiple-choice',
        options: [
          'The branch is deleted',
          'Changes from the branch are integrated into the current branch',
          'A new repository is created',
          'All files are duplicated'
        ],
        correctAnswer: 1,
        explanation: 'Merging integrates changes from one branch into another branch, typically combining the work done in parallel.',
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'remote-repos-quiz',
    lessonId: 'remote-repos',
    title: 'Remote Repositories Quiz',
    description: 'Test your understanding of working with remote repositories',
    passingScore: 80,
    timeLimit: 15,
    questions: [
      {
        id: 'q1',
        question: 'What is a remote repository?',
        type: 'multiple-choice',
        options: [
          'A repository stored on your local machine',
          'A repository hosted on a server that multiple people can access',
          'A backup of your local repository',
          'A different version of Git'
        ],
        correctAnswer: 1,
        explanation: 'A remote repository is a version of your project hosted on a server (like GitHub, GitLab) that enables collaboration with others.',
        difficulty: 'easy'
      },
      {
        id: 'q2',
        question: 'Which command downloads a repository from a remote source?',
        type: 'multiple-choice',
        options: [
          'git download',
          'git copy',
          'git clone',
          'git get'
        ],
        correctAnswer: 2,
        explanation: 'The "git clone" command creates a local copy of a remote repository, including all its history and branches.',
        difficulty: 'easy'
      },
      {
        id: 'q3',
        question: 'What does "git push" do?',
        type: 'multiple-choice',
        options: [
          'Downloads changes from remote',
          'Uploads your local commits to the remote repository',
          'Creates a new branch',
          'Merges branches'
        ],
        correctAnswer: 1,
        explanation: 'The "git push" command uploads your local commits to the remote repository, sharing your changes with others.',
        difficulty: 'easy'
      },
      {
        id: 'q4',
        question: 'You should always pull before pushing to avoid conflicts.',
        type: 'true-false',
        correctAnswer: true,
        explanation: 'It\'s a best practice to pull the latest changes before pushing to ensure you\'re working with the most recent version and to minimize conflicts.',
        difficulty: 'medium'
      },
      {
        id: 'q5',
        question: 'What\'s the difference between "git fetch" and "git pull"?',
        type: 'multiple-choice',
        options: [
          'There is no difference',
          'fetch downloads changes but doesn\'t merge, pull downloads and merges',
          'fetch is faster than pull',
          'pull is for branches, fetch is for commits'
        ],
        correctAnswer: 1,
        explanation: 'git fetch downloads changes from remote but doesn\'t merge them, while git pull downloads and automatically merges the changes.',
        difficulty: 'hard'
      }
    ]
  },
  {
    id: 'advanced-git-quiz',
    lessonId: 'advanced-git',
    title: 'Advanced Git Quiz',
    description: 'Test your mastery of advanced Git techniques',
    passingScore: 85,
    timeLimit: 20,
    questions: [
      {
        id: 'q1',
        question: 'What is the main difference between merge and rebase?',
        type: 'multiple-choice',
        options: [
          'Merge is faster than rebase',
          'Merge creates a merge commit, rebase rewrites commit history',
          'Rebase only works with remote branches',
          'There is no difference'
        ],
        correctAnswer: 1,
        explanation: 'Merge creates a new merge commit that combines two branches, while rebase rewrites commit history by moving commits to a new base.',
        difficulty: 'hard'
      },
      {
        id: 'q2',
        question: 'When should you avoid using rebase?',
        type: 'multiple-choice',
        options: [
          'When working alone',
          'When the commits have been pushed and shared with others',
          'When working on the main branch',
          'Never, rebase is always safe'
        ],
        correctAnswer: 1,
        explanation: 'You should avoid rebasing commits that have been pushed and shared with others, as it rewrites history and can cause problems for collaborators.',
        difficulty: 'hard'
      },
      {
        id: 'q3',
        question: 'What does "git cherry-pick" do?',
        type: 'multiple-choice',
        options: [
          'Deletes specific commits',
          'Applies a specific commit from one branch to another',
          'Creates a new branch',
          'Merges all branches'
        ],
        correctAnswer: 1,
        explanation: 'Cherry-pick allows you to apply a specific commit from one branch to your current branch without merging the entire branch.',
        difficulty: 'medium'
      },
      {
        id: 'q4',
        question: 'Git stash temporarily saves your uncommitted changes.',
        type: 'true-false',
        correctAnswer: true,
        explanation: 'Git stash temporarily saves your uncommitted changes so you can work on something else and then come back and re-apply them later.',
        difficulty: 'medium'
      },
      {
        id: 'q5',
        question: 'What\'s the difference between "git reset" and "git revert"?',
        type: 'multiple-choice',
        options: [
          'Reset moves the branch pointer, revert creates a new commit that undoes changes',
          'Revert is safer for shared repositories',
          'Reset changes history, revert preserves history',
          'All of the above'
        ],
        correctAnswer: 3,
        explanation: 'Reset moves the branch pointer and can change history (dangerous for shared repos), while revert creates a new commit that undoes changes, preserving history.',
        difficulty: 'hard'
      }
    ]
  }
];

export function getQuizByLessonId(lessonId: string): Quiz | undefined {
  return quizzes.find(quiz => quiz.lessonId === lessonId);
}
