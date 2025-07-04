'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface LessonStep {
  id: number;
  title: string;
  description: string;
  command: string;
  explanation: string;
  beforeState: {
    workingDirectory: string[];
    stagingArea: string[];
    repository: string[];
    currentBranch: string;
    branches: string[];
  };
  afterState: {
    workingDirectory: string[];
    stagingArea: string[];
    repository: string[];
    currentBranch: string;
    branches: string[];
  };
  output: string;
}

interface InteractiveLessonProps {
  lessonId: string;
  onComplete: () => void;
  onBack: () => void;
}

const lessonContent: Record<string, LessonStep[]> = {
  'git-basics': [
    {
      id: 1,
      title: 'Initialize a Git Repository',
      description: 'Every Git project starts with initializing a repository. This creates a hidden .git folder that tracks all changes.',
      command: 'git init',
      explanation: 'This command creates a new Git repository in the current directory. It sets up all the necessary files and folders for version control.',
      beforeState: {
        workingDirectory: [],
        stagingArea: [],
        repository: [],
        currentBranch: '',
        branches: []
      },
      afterState: {
        workingDirectory: [],
        stagingArea: [],
        repository: [],
        currentBranch: 'main',
        branches: ['main']
      },
      output: 'Initialized empty Git repository in /project/.git/'
    },
    {
      id: 2,
      title: 'Check Repository Status',
      description: 'The status command shows you what files have changed and what\'s ready to be committed.',
      command: 'git status',
      explanation: 'This command displays the state of the working directory and staging area. It shows which files are tracked, untracked, or modified.',
      beforeState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: [],
        repository: [],
        currentBranch: 'main',
        branches: ['main']
      },
      afterState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: [],
        repository: [],
        currentBranch: 'main',
        branches: ['main']
      },
      output: 'On branch main\n\nNo commits yet\n\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n\tREADME.md\n\tindex.html\n\nnothing added to commit but untracked files present (use "git add" to track)'
    },
    {
      id: 3,
      title: 'Stage Files for Commit',
      description: 'Before committing changes, you need to stage them. This tells Git which changes you want to include in the next commit.',
      command: 'git add README.md',
      explanation: 'This command adds the README.md file to the staging area. Staged files are ready to be committed to the repository.',
      beforeState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: [],
        repository: [],
        currentBranch: 'main',
        branches: ['main']
      },
      afterState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: ['README.md'],
        repository: [],
        currentBranch: 'main',
        branches: ['main']
      },
      output: ''
    },
    {
      id: 4,
      title: 'Commit Your Changes',
      description: 'A commit saves your staged changes to the repository with a descriptive message.',
      command: 'git commit -m "Add README file"',
      explanation: 'This command creates a new commit with the staged changes. The -m flag allows you to add a commit message inline.',
      beforeState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: ['README.md'],
        repository: [],
        currentBranch: 'main',
        branches: ['main']
      },
      afterState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: [],
        repository: ['README.md'],
        currentBranch: 'main',
        branches: ['main']
      },
      output: '[main (root-commit) a1b2c3d] Add README file\n 1 file changed, 1 insertion(+)\n create mode 100644 README.md'
    }
  ],
  'branching': [
    {
      id: 1,
      title: 'Create a New Branch',
      description: 'Branches allow you to work on different features without affecting the main codebase.',
      command: 'git branch feature-login',
      explanation: 'This command creates a new branch called "feature-login" based on the current branch. You\'re still on the original branch.',
      beforeState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: [],
        repository: ['README.md'],
        currentBranch: 'main',
        branches: ['main']
      },
      afterState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: [],
        repository: ['README.md'],
        currentBranch: 'main',
        branches: ['main', 'feature-login']
      },
      output: ''
    },
    {
      id: 2,
      title: 'Switch to the New Branch',
      description: 'To work on your new branch, you need to switch to it using checkout.',
      command: 'git checkout feature-login',
      explanation: 'This command switches your working directory to the feature-login branch. Now any commits you make will be on this branch.',
      beforeState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: [],
        repository: ['README.md'],
        currentBranch: 'main',
        branches: ['main', 'feature-login']
      },
      afterState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: [],
        repository: ['README.md'],
        currentBranch: 'feature-login',
        branches: ['main', 'feature-login']
      },
      output: 'Switched to branch \'feature-login\''
    },
    {
      id: 3,
      title: 'Make Changes on the Branch',
      description: 'Now you can make changes specific to this feature without affecting the main branch.',
      command: 'git add login.html && git commit -m "Add login page"',
      explanation: 'This adds a new file and commits it to the feature branch. The main branch remains unchanged.',
      beforeState: {
        workingDirectory: ['README.md', 'index.html', 'login.html'],
        stagingArea: [],
        repository: ['README.md'],
        currentBranch: 'feature-login',
        branches: ['main', 'feature-login']
      },
      afterState: {
        workingDirectory: ['README.md', 'index.html', 'login.html'],
        stagingArea: [],
        repository: ['README.md', 'login.html'],
        currentBranch: 'feature-login',
        branches: ['main', 'feature-login']
      },
      output: '[feature-login e4f5g6h] Add login page\n 1 file changed, 10 insertions(+)\n create mode 100644 login.html'
    },
    {
      id: 4,
      title: 'Merge the Branch',
      description: 'When your feature is complete, merge it back into the main branch.',
      command: 'git checkout main && git merge feature-login',
      explanation: 'First switch to main, then merge the feature branch. This brings the login page changes into the main branch.',
      beforeState: {
        workingDirectory: ['README.md', 'index.html', 'login.html'],
        stagingArea: [],
        repository: ['README.md', 'login.html'],
        currentBranch: 'feature-login',
        branches: ['main', 'feature-login']
      },
      afterState: {
        workingDirectory: ['README.md', 'index.html', 'login.html'],
        stagingArea: [],
        repository: ['README.md', 'login.html'],
        currentBranch: 'main',
        branches: ['main', 'feature-login']
      },
      output: 'Switched to branch \'main\'\nUpdating a1b2c3d..e4f5g6h\nFast-forward\n login.html | 10 ++++++++++\n 1 file changed, 10 insertions(+)'
    }
  ],
  'remote-repos': [
    {
      id: 1,
      title: 'Add a Remote Repository',
      description: 'Connect your local repository to a remote repository (like GitHub) for collaboration.',
      command: 'git remote add origin https://github.com/user/repo.git',
      explanation: 'This command adds a remote repository called "origin". This is where you\'ll push your code to share with others.',
      beforeState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: [],
        repository: ['README.md'],
        currentBranch: 'main',
        branches: ['main']
      },
      afterState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: [],
        repository: ['README.md'],
        currentBranch: 'main',
        branches: ['main']
      },
      output: ''
    },
    {
      id: 2,
      title: 'Push to Remote Repository',
      description: 'Upload your local commits to the remote repository so others can see your work.',
      command: 'git push -u origin main',
      explanation: 'This pushes your main branch to the remote repository. The -u flag sets up tracking between local and remote branches.',
      beforeState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: [],
        repository: ['README.md'],
        currentBranch: 'main',
        branches: ['main']
      },
      afterState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: [],
        repository: ['README.md'],
        currentBranch: 'main',
        branches: ['main']
      },
      output: 'Enumerating objects: 3, done.\nCounting objects: 100% (3/3), done.\nWriting objects: 100% (3/3), 242 bytes | 242.00 KiB/s, done.\nTotal 3 (delta 0), reused 0 (delta 0)\nTo https://github.com/user/repo.git\n * [new branch]      main -> main\nBranch \'main\' set up to track remote branch \'main\' from \'origin\'.'
    },
    {
      id: 3,
      title: 'Pull Changes from Remote',
      description: 'Download and merge changes from the remote repository to stay up to date.',
      command: 'git pull origin main',
      explanation: 'This fetches changes from the remote repository and merges them into your local branch. Essential for collaboration.',
      beforeState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: [],
        repository: ['README.md'],
        currentBranch: 'main',
        branches: ['main']
      },
      afterState: {
        workingDirectory: ['README.md', 'index.html', 'style.css'],
        stagingArea: [],
        repository: ['README.md', 'style.css'],
        currentBranch: 'main',
        branches: ['main']
      },
      output: 'remote: Enumerating objects: 4, done.\nremote: Counting objects: 100% (4/4), done.\nremote: Compressing objects: 100% (2/2), done.\nremote: Total 3 (delta 0), reused 3 (delta 0), pack-reused 0\nUnpacking objects: 100% (3/3), done.\nFrom https://github.com/user/repo\n * branch            main       -> FETCH_HEAD\n   a1b2c3d..f7g8h9i  main       -> origin/main\nUpdating a1b2c3d..f7g8h9i\nFast-forward\n style.css | 15 +++++++++++++++\n 1 file changed, 15 insertions(+)'
    }
  ],
  'advanced-git': [
    {
      id: 1,
      title: 'Stash Your Changes',
      description: 'Temporarily save your work without committing when you need to switch contexts quickly.',
      command: 'git stash',
      explanation: 'This saves your current changes to a temporary area and reverts your working directory to the last commit.',
      beforeState: {
        workingDirectory: ['README.md (modified)', 'index.html', 'new-file.js'],
        stagingArea: [],
        repository: ['README.md', 'index.html'],
        currentBranch: 'main',
        branches: ['main']
      },
      afterState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: [],
        repository: ['README.md', 'index.html'],
        currentBranch: 'main',
        branches: ['main']
      },
      output: 'Saved working directory and index state WIP on main: a1b2c3d Add initial files'
    },
    {
      id: 2,
      title: 'Restore Stashed Changes',
      description: 'Bring back your stashed changes when you\'re ready to continue working on them.',
      command: 'git stash pop',
      explanation: 'This restores the most recent stash and removes it from the stash list. Your changes are back in the working directory.',
      beforeState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: [],
        repository: ['README.md', 'index.html'],
        currentBranch: 'main',
        branches: ['main']
      },
      afterState: {
        workingDirectory: ['README.md (modified)', 'index.html', 'new-file.js'],
        stagingArea: [],
        repository: ['README.md', 'index.html'],
        currentBranch: 'main',
        branches: ['main']
      },
      output: 'On branch main\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n  (use "git checkout -- <file>..." to discard changes in working directory)\n\n\tmodified:   README.md\n\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n\n\tnew-file.js\n\nDropped refs/stash@{0} (1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t)'
    },
    {
      id: 3,
      title: 'Interactive Rebase',
      description: 'Rewrite commit history to clean up your branch before merging.',
      command: 'git rebase -i HEAD~3',
      explanation: 'This opens an interactive rebase for the last 3 commits, allowing you to squash, reorder, or edit commits.',
      beforeState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: [],
        repository: ['README.md', 'index.html', 'style.css'],
        currentBranch: 'feature',
        branches: ['main', 'feature']
      },
      afterState: {
        workingDirectory: ['README.md', 'index.html'],
        stagingArea: [],
        repository: ['README.md', 'index.html', 'style.css'],
        currentBranch: 'feature',
        branches: ['main', 'feature']
      },
      output: 'Successfully rebased and updated refs/heads/feature.\n\n# Interactive rebase completed:\n# - 3 commits were squashed into 1\n# - Commit messages were combined\n# - History is now cleaner'
    }
  ]
};

export function InteractiveLesson({ lessonId, onComplete, onBack }: InteractiveLessonProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showCommand, setShowCommand] = useState(false);
  
  const steps = lessonContent[lessonId] || [];
  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNextStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowCommand(false);
    } else {
      onComplete();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowCommand(false);
    }
  };

  const executeCommand = () => {
    setShowCommand(true);
  };

  if (!currentStepData) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Lesson content not found</h2>
        <Button onClick={onBack}>Back to Lessons</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Back to Lessons
        </Button>
        <Badge variant="outline">
          Step {currentStep + 1} of {steps.length}
        </Badge>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lesson Progress</CardTitle>
            <span className="text-sm text-slate-600">{Math.round(progress)}% Complete</span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>

      {/* Current Step */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{currentStepData.title}</CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Command to Execute */}
            <div>
              <h3 className="font-semibold mb-2">Command to Execute:</h3>
              <div className="bg-black text-green-400 p-3 rounded-lg font-mono">
                $ {currentStepData.command}
              </div>
            </div>

            {/* Explanation */}
            <div>
              <h3 className="font-semibold mb-2">What this does:</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {currentStepData.explanation}
              </p>
            </div>

            {/* Execute Button */}
            <Button 
              onClick={executeCommand} 
              className="w-full"
              disabled={showCommand}
            >
              {showCommand ? 'Command Executed!' : 'Execute Command'}
            </Button>
          </CardContent>
        </Card>

        {/* Visual State */}
        <Card>
          <CardHeader>
            <CardTitle>Repository State</CardTitle>
            <CardDescription>See how the command changes your repository</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Before/After Toggle */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2 text-red-600">Before</h3>
                <div className="space-y-2">
                  <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded text-xs">
                    <div className="font-semibold">Working Directory:</div>
                    {currentStepData.beforeState.workingDirectory.map((file, i) => (
                      <div key={i}>📄 {file}</div>
                    ))}
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded text-xs">
                    <div className="font-semibold">Staging Area:</div>
                    {currentStepData.beforeState.stagingArea.map((file, i) => (
                      <div key={i}>📄 {file}</div>
                    ))}
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-xs">
                    <div className="font-semibold">Repository:</div>
                    {currentStepData.beforeState.repository.map((file, i) => (
                      <div key={i}>📦 {file}</div>
                    ))}
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-xs">
                    <div className="font-semibold">Current Branch:</div>
                    <div>{currentStepData.beforeState.currentBranch || 'None'}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-green-600">After</h3>
                <div className={`space-y-2 transition-opacity duration-500 ${showCommand ? 'opacity-100' : 'opacity-50'}`}>
                  <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded text-xs">
                    <div className="font-semibold">Working Directory:</div>
                    {currentStepData.afterState.workingDirectory.map((file, i) => (
                      <div key={i}>📄 {file}</div>
                    ))}
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded text-xs">
                    <div className="font-semibold">Staging Area:</div>
                    {currentStepData.afterState.stagingArea.map((file, i) => (
                      <div key={i}>📄 {file}</div>
                    ))}
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-xs">
                    <div className="font-semibold">Repository:</div>
                    {currentStepData.afterState.repository.map((file, i) => (
                      <div key={i}>📦 {file}</div>
                    ))}
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-xs">
                    <div className="font-semibold">Current Branch:</div>
                    <div>{currentStepData.afterState.currentBranch || 'None'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Command Output */}
            {showCommand && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Command Output:</h3>
                <div className="bg-black text-green-400 p-3 rounded-lg font-mono text-xs whitespace-pre-line">
                  {currentStepData.output || '(No output)'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevStep}
          disabled={currentStep === 0}
        >
          Previous Step
        </Button>
        
        <Button 
          onClick={handleNextStep}
          disabled={!showCommand}
        >
          {currentStep === steps.length - 1 ? 'Complete Lesson' : 'Next Step'}
        </Button>
      </div>
    </div>
  );
}
