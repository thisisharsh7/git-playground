'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitLessons } from "@/components/git-lessons";
import { GitCommands } from "@/components/git-commands";
import { GitVisualization } from "@/components/git-visualization";

interface GitState {
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

interface CommandHistory {
  command: string;
  output: string;
  timestamp: string;
  success: boolean;
}

export default function GitPlaygroundPage() {
  const [gitState, setGitState] = useState<GitState>({
    currentBranch: 'main',
    branches: ['main'],
    commits: [
      {
        id: 'a1b2c3d',
        message: 'Initial commit',
        author: 'Developer',
        timestamp: new Date().toISOString(),
        branch: 'main'
      }
    ],
    workingDirectory: ['README.md', 'index.html'],
    stagingArea: [],
    remotes: [],
    status: 'clean'
  });

  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([
    {
      command: 'git init',
      output: 'Initialized empty Git repository in /project/.git/',
      timestamp: new Date().toISOString(),
      success: true
    }
  ]);
  const [selectedSection, setSelectedSection] = useState('playground');
  const terminalRef = useRef<HTMLDivElement>(null);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    let output = '';
    let success = true;
    const newGitState = { ...gitState };

    // Parse and execute Git commands
    const parts = trimmedCmd.split(' ');
    const gitCommand = parts[1];

    switch (gitCommand) {
      case 'status':
        output = generateStatusOutput();
        break;
      case 'add':
        if (parts[2] === '.') {
          newGitState.stagingArea = [...newGitState.workingDirectory];
          output = 'Added all files to staging area';
        } else if (parts[2]) {
          if (newGitState.workingDirectory.includes(parts[2])) {
            newGitState.stagingArea.push(parts[2]);
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
            id: Math.random().toString(36).substr(2, 7),
            message: message.replace(/['"]/g, ''),
            author: 'Developer',
            timestamp: new Date().toISOString(),
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
          .map(c => `commit ${c.id}\nAuthor: ${c.author}\nDate: ${new Date(c.timestamp).toLocaleString()}\n\n    ${c.message}\n`)
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

    const newCommand: CommandHistory = {
      command: trimmedCmd,
      output,
      timestamp: new Date().toISOString(),
      success
    };

    setCommandHistory(prev => [...prev, newCommand]);
    setGitState(newGitState);
    setCommand('');
  };

  const generateStatusOutput = () => {
    let output = `On branch ${gitState.currentBranch}\n`;
    
    if (gitState.stagingArea.length > 0) {
      output += '\nChanges to be committed:\n';
      output += '  (use "git reset HEAD <file>..." to unstage)\n\n';
      gitState.stagingArea.forEach(file => {
        output += `\tmodified:   ${file}\n`;
      });
    }
    
    const unstagedFiles = gitState.workingDirectory.filter(f => !gitState.stagingArea.includes(f));
    if (unstagedFiles.length > 0) {
      output += '\nChanges not staged for commit:\n';
      output += '  (use "git add <file>..." to update what will be committed)\n\n';
      unstagedFiles.forEach(file => {
        output += `\tmodified:   ${file}\n`;
      });
    }
    
    if (gitState.stagingArea.length === 0 && unstagedFiles.length === 0) {
      output += 'nothing to commit, working tree clean';
    }
    
    return output;
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="border-b bg-white dark:bg-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Git Playground
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Learn Git commands interactively with real-time visualization
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={selectedSection} onValueChange={setSelectedSection}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="playground">Playground</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="commands">Commands</TabsTrigger>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
          </TabsList>

          <TabsContent value="playground" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Terminal */}
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-green-500">●</span>
                    Terminal
                  </CardTitle>
                  <CardDescription>Execute Git commands and see real-time results</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div 
                    ref={terminalRef}
                    className="flex-1 bg-black text-green-400 p-4 rounded-lg font-mono text-sm overflow-y-auto mb-4"
                  >
                    {commandHistory.map((cmd, index) => (
                      <div key={index} className="mb-2">
                        <div className="text-blue-400">$ {cmd.command}</div>
                        <div className={cmd.success ? 'text-green-400' : 'text-red-400'}>
                          {cmd.output}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <span className="text-blue-500 font-mono">$</span>
                    <Input
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && executeCommand(command)}
                      placeholder="Enter git command..."
                      className="font-mono"
                    />
                    <Button onClick={() => executeCommand(command)}>Run</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Git State Visualization */}
              <Card className="h-[600px]">
                <CardHeader>
                  <CardTitle>Repository State</CardTitle>
                  <CardDescription>Visual representation of your Git repository</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Current Branch */}
                  <div>
                    <h3 className="font-semibold mb-2">Current Branch</h3>
                    <Badge variant="outline" className="bg-blue-50">
                      {gitState.currentBranch}
                    </Badge>
                  </div>

                  {/* Branches */}
                  <div>
                    <h3 className="font-semibold mb-2">All Branches</h3>
                    <div className="flex flex-wrap gap-2">
                      {gitState.branches.map(branch => (
                        <Badge 
                          key={branch}
                          variant={branch === gitState.currentBranch ? "default" : "secondary"}
                        >
                          {branch}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Working Directory */}
                  <div>
                    <h3 className="font-semibold mb-2">Working Directory</h3>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                      {gitState.workingDirectory.map(file => (
                        <div key={file} className="flex items-center gap-2 text-sm">
                          <span className="text-blue-500">📄</span>
                          {file}
                          {gitState.stagingArea.includes(file) && (
                            <Badge variant="outline" className="text-xs">staged</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Commits */}
                  <div>
                    <h3 className="font-semibold mb-2">Recent Commits</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {gitState.commits.slice(-3).reverse().map(commit => (
                        <div key={commit.id} className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm">
                          <div className="font-mono text-xs text-slate-500">{commit.id}</div>
                          <div>{commit.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Commands */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Commands</CardTitle>
                <CardDescription>Click to execute common Git commands</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button variant="outline" onClick={() => executeCommand('git status')}>
                    git status
                  </Button>
                  <Button variant="outline" onClick={() => executeCommand('git add .')}>
                    git add .
                  </Button>
                  <Button variant="outline" onClick={() => executeCommand('git commit -m "Update files"')}>
                    git commit
                  </Button>
                  <Button variant="outline" onClick={() => executeCommand('git log')}>
                    git log
                  </Button>
                  <Button variant="outline" onClick={() => executeCommand('git branch')}>
                    git branch
                  </Button>
                  <Button variant="outline" onClick={() => executeCommand('git branch feature')}>
                    new branch
                  </Button>
                  <Button variant="outline" onClick={() => executeCommand('git checkout feature')}>
                    checkout
                  </Button>
                  <Button variant="outline" onClick={() => executeCommand('git remote -v')}>
                    git remote
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons">
            <GitLessons />
          </TabsContent>

          <TabsContent value="commands">
            <GitCommands />
          </TabsContent>

          <TabsContent value="visualization">
            <GitVisualization />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
