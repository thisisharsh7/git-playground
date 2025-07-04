'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface GitCommand {
  command: string;
  description: string;
  category: string;
  usage: string;
  examples: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const gitCommands: GitCommand[] = [
  // Basic Commands
  {
    command: 'git init',
    description: 'Initialize a new Git repository',
    category: 'Basic',
    usage: 'git init [directory]',
    examples: ['git init', 'git init my-project'],
    difficulty: 'Beginner'
  },
  {
    command: 'git clone',
    description: 'Clone a repository from remote source',
    category: 'Basic',
    usage: 'git clone <repository-url> [directory]',
    examples: ['git clone https://github.com/user/repo.git', 'git clone https://github.com/user/repo.git my-folder'],
    difficulty: 'Beginner'
  },
  {
    command: 'git status',
    description: 'Show the working tree status',
    category: 'Basic',
    usage: 'git status [options]',
    examples: ['git status', 'git status --short'],
    difficulty: 'Beginner'
  },
  {
    command: 'git add',
    description: 'Add file contents to the staging area',
    category: 'Basic',
    usage: 'git add <file>',
    examples: ['git add file.txt', 'git add .', 'git add *.js'],
    difficulty: 'Beginner'
  },
  {
    command: 'git commit',
    description: 'Record changes to the repository',
    category: 'Basic',
    usage: 'git commit [options]',
    examples: ['git commit -m "Add new feature"', 'git commit -am "Fix bug"'],
    difficulty: 'Beginner'
  },
  
  // Branching Commands
  {
    command: 'git branch',
    description: 'List, create, or delete branches',
    category: 'Branching',
    usage: 'git branch [options] [branch-name]',
    examples: ['git branch', 'git branch feature-branch', 'git branch -d old-branch'],
    difficulty: 'Beginner'
  },
  {
    command: 'git checkout',
    description: 'Switch branches or restore working tree files',
    category: 'Branching',
    usage: 'git checkout <branch-name>',
    examples: ['git checkout main', 'git checkout -b new-feature', 'git checkout -- file.txt'],
    difficulty: 'Beginner'
  },
  {
    command: 'git merge',
    description: 'Join two or more development histories together',
    category: 'Branching',
    usage: 'git merge <branch-name>',
    examples: ['git merge feature-branch', 'git merge --no-ff feature'],
    difficulty: 'Intermediate'
  },
  
  // Remote Commands
  {
    command: 'git remote',
    description: 'Manage set of tracked repositories',
    category: 'Remote',
    usage: 'git remote [options]',
    examples: ['git remote -v', 'git remote add origin https://github.com/user/repo.git'],
    difficulty: 'Beginner'
  },
  {
    command: 'git push',
    description: 'Update remote refs along with associated objects',
    category: 'Remote',
    usage: 'git push [remote] [branch]',
    examples: ['git push origin main', 'git push -u origin feature-branch'],
    difficulty: 'Beginner'
  },
  {
    command: 'git pull',
    description: 'Fetch from and integrate with another repository or branch',
    category: 'Remote',
    usage: 'git pull [remote] [branch]',
    examples: ['git pull origin main', 'git pull --rebase origin main'],
    difficulty: 'Beginner'
  },
  {
    command: 'git fetch',
    description: 'Download objects and refs from another repository',
    category: 'Remote',
    usage: 'git fetch [remote]',
    examples: ['git fetch origin', 'git fetch --all'],
    difficulty: 'Intermediate'
  },
  
  // History Commands
  {
    command: 'git log',
    description: 'Show commit logs',
    category: 'History',
    usage: 'git log [options]',
    examples: ['git log', 'git log --oneline', 'git log --graph --all'],
    difficulty: 'Beginner'
  },
  {
    command: 'git diff',
    description: 'Show changes between commits, commit and working tree, etc',
    category: 'History',
    usage: 'git diff [options]',
    examples: ['git diff', 'git diff HEAD~1', 'git diff --staged'],
    difficulty: 'Beginner'
  },
  {
    command: 'git show',
    description: 'Show various types of objects',
    category: 'History',
    usage: 'git show [object]',
    examples: ['git show HEAD', 'git show commit-hash'],
    difficulty: 'Intermediate'
  },
  
  // Advanced Commands
  {
    command: 'git rebase',
    description: 'Reapply commits on top of another base tip',
    category: 'Advanced',
    usage: 'git rebase [options] [upstream] [branch]',
    examples: ['git rebase main', 'git rebase -i HEAD~3'],
    difficulty: 'Advanced'
  },
  {
    command: 'git stash',
    description: 'Stash the changes in a dirty working directory away',
    category: 'Advanced',
    usage: 'git stash [options]',
    examples: ['git stash', 'git stash pop', 'git stash list'],
    difficulty: 'Intermediate'
  },
  {
    command: 'git reset',
    description: 'Reset current HEAD to the specified state',
    category: 'Advanced',
    usage: 'git reset [options] [commit]',
    examples: ['git reset HEAD~1', 'git reset --hard HEAD~1', 'git reset --soft HEAD~1'],
    difficulty: 'Advanced'
  },
  {
    command: 'git cherry-pick',
    description: 'Apply the changes introduced by some existing commits',
    category: 'Advanced',
    usage: 'git cherry-pick <commit>',
    examples: ['git cherry-pick abc123', 'git cherry-pick -n abc123'],
    difficulty: 'Advanced'
  }
];

export function GitCommands() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCommand, setSelectedCommand] = useState<GitCommand | null>(null);

  const categories = ['All', ...Array.from(new Set(gitCommands.map(cmd => cmd.category)))];
  
  const filteredCommands = gitCommands.filter(cmd => {
    const matchesSearch = cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cmd.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || cmd.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Basic': return 'bg-blue-100 text-blue-800';
      case 'Branching': return 'bg-purple-100 text-purple-800';
      case 'Remote': return 'bg-orange-100 text-orange-800';
      case 'History': return 'bg-teal-100 text-teal-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedCommand) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedCommand(null)}>
            ← Back to Commands
          </Button>
          <div className="flex gap-2">
            <Badge className={getCategoryColor(selectedCommand.category)}>
              {selectedCommand.category}
            </Badge>
            <Badge className={getDifficultyColor(selectedCommand.difficulty)}>
              {selectedCommand.difficulty}
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-xl">{selectedCommand.command}</CardTitle>
            <CardDescription className="text-base">{selectedCommand.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Usage */}
            <div>
              <h3 className="font-semibold mb-2">Usage:</h3>
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                <code className="font-mono text-sm">{selectedCommand.usage}</code>
              </div>
            </div>

            {/* Examples */}
            <div>
              <h3 className="font-semibold mb-2">Examples:</h3>
              <div className="space-y-2">
                {selectedCommand.examples.map((example, index) => (
                  <div key={index} className="bg-black text-green-400 p-3 rounded-lg">
                    <code className="font-mono text-sm">$ {example}</code>
                  </div>
                ))}
              </div>
            </div>

            {/* Try it button */}
            <div className="pt-4">
              <Button className="w-full" onClick={() => {
                // This would integrate with the playground
                console.log('Try command:', selectedCommand.command);
              }}>
                Try in Playground
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Git Command Reference</CardTitle>
          <CardDescription>Search and explore Git commands by category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search commands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCommands.map((command) => (
          <Card 
            key={command.command}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedCommand(command)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-mono text-lg">{command.command}</CardTitle>
                <Badge className={getDifficultyColor(command.difficulty)}>
                  {command.difficulty}
                </Badge>
              </div>
              <Badge className={getCategoryColor(command.category)} variant="outline">
                {command.category}
              </Badge>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {command.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Command Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{gitCommands.length}</div>
              <div className="text-sm text-slate-600">Total Commands</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {gitCommands.filter(c => c.difficulty === 'Beginner').length}
              </div>
              <div className="text-sm text-slate-600">Beginner</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {gitCommands.filter(c => c.difficulty === 'Intermediate').length}
              </div>
              <div className="text-sm text-slate-600">Intermediate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {gitCommands.filter(c => c.difficulty === 'Advanced').length}
              </div>
              <div className="text-sm text-slate-600">Advanced</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
