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
  const [isClient, setIsClient] = useState(false);
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
  const [isTyping, setIsTyping] = useState(false);
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

  const handleNavigateToLesson = (lessonId: string) => {
    setSelectedSection('lessons');
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setIsTyping(true);
    
    // Simulate typing delay for better UX
    setTimeout(() => {
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
    setIsTyping(false);
    }, 500); // 500ms delay for typing effect
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
    <div className="min-h-screen" suppressHydrationWarning>
      {/* Hero Header - Scrolls away */}
      <div className="bg-gradient-to-r from-blue-50/80 via-purple-50/80 to-pink-50/80 dark:from-slate-900/80 dark:via-slate-800/80 dark:to-slate-900/80 backdrop-blur-md px-4 md:px-6 py-12 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-3xl">🎮</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Git Playground
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium">
                Master Git commands through interactive practice and real-time visualization
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Interactive Terminal</span>
            </div>
            <div className="flex items-center gap-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Real-time Visualization</span>
            </div>
            <div className="flex items-center gap-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <span className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Safe Learning Environment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tabs Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-3">
          <Tabs value={selectedSection} onValueChange={setSelectedSection}>
            <TabsList className="h-9 sm:h-10 md:h-12">
              <TabsTrigger value="playground">
                <span className="text-base sm:text-lg mr-1 sm:mr-2">🎮</span>
                <span className="text-xs sm:text-sm md:text-base font-medium truncate">
                  <span className="hidden sm:inline">Playground</span>
                  <span className="sm:hidden">Play</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="lessons">
                <span className="text-base sm:text-lg mr-1 sm:mr-2">📚</span>
                <span className="text-xs sm:text-sm md:text-base font-medium truncate">
                  <span className="hidden sm:inline">Lessons</span>
                  <span className="sm:hidden">Learn</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="commands">
                <span className="text-base sm:text-lg mr-1 sm:mr-2">📋</span>
                <span className="text-xs sm:text-sm md:text-base font-medium truncate">
                  <span className="hidden sm:inline">Commands</span>
                  <span className="sm:hidden">Cmd</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="visualization">
                <span className="text-base sm:text-lg mr-1 sm:mr-2">📊</span>
                <span className="text-xs sm:text-sm md:text-base font-medium truncate">
                  <span className="hidden sm:inline">Visualization</span>
                  <span className="sm:hidden">Visual</span>
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 pb-12">
        <Tabs value={selectedSection} onValueChange={setSelectedSection}>
          <TabsContent value="playground" className="space-y-8 mt-0">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* Terminal */}
              <Card className="h-[500px] md:h-[600px] flex flex-col bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl ring-1 ring-slate-200/50 dark:ring-slate-700/50">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-t-lg border-b border-slate-200/50 dark:border-slate-600/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                      </div>
                      <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-bold">
                        Interactive Terminal
                      </span>
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span>Live</span>
                    </div>
                  </div>
                  <CardDescription className="text-base text-slate-600 dark:text-slate-300 font-medium">
                    Execute Git commands and see real-time results in a safe environment
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <div 
                    ref={terminalRef}
                    className="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-green-400 p-4 md:p-6 font-mono text-sm md:text-base overflow-y-auto border-b border-slate-600/50"
                    style={{
                      backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                                       radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
                    }}
                  >
                    {commandHistory.map((cmd, index) => (
                      <div key={index} className="mb-3 group">
                        <div className="text-blue-400 break-all flex items-center gap-2">
                          <span className="text-green-400">➜</span>
                          <span className="text-cyan-400">git-playground</span>
                          <span className="text-blue-400">git:(main)</span>
                          <span className="text-white">$</span>
                          <span>{cmd.command}</span>
                        </div>
                        <div className={`${cmd.success ? 'text-green-300' : 'text-red-400'} whitespace-pre-wrap break-words ml-4 mt-1 opacity-90`}>
                          {cmd.output}
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 text-blue-400">
                      <span className="text-green-400">➜</span>
                      <span className="text-cyan-400">git-playground</span>
                      <span className="text-blue-400">git:(main)</span>
                      <span className="text-white">$</span>
                      {isClient && isTyping && (
                        <span className="text-yellow-400 animate-pulse">Processing...</span>
                      )}
                      {isClient && !isTyping && (
                        <span className="w-2 h-4 bg-green-400 animate-pulse ml-1"></span>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200/50 dark:border-slate-600/50">
                    <div className="flex gap-3">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-mono text-sm">
                        <span className="text-green-500">$</span>
                      </div>
                      <Input
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isTyping && executeCommand(command)}
                        placeholder="Type your Git command here..."
                        disabled={isTyping}
                        className="font-mono text-sm md:text-base bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 disabled:opacity-50"
                      />
                      <Button 
                        onClick={() => executeCommand(command)} 
                        disabled={isTyping || !command.trim()}
                        className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isClient && isTyping ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Running...</span>
                          </div>
                        ) : (
                          'Execute'
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Git State Visualization */}
              <Card className="h-[500px] md:h-[600px] bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl ring-1 ring-slate-200/50 dark:ring-slate-700/50">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-t-lg border-b border-slate-200/50 dark:border-slate-600/50">
                  <CardTitle className="text-xl md:text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                    Repository State
                  </CardTitle>
                  <CardDescription className="text-base text-slate-600 dark:text-slate-300 font-medium">
                    Live visualization of your Git repository structure and changes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 overflow-y-auto p-6">
                  
                  {/* Current Branch */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                    <h3 className="font-bold mb-3 text-base md:text-lg flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      Current Branch
                    </h3>
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm md:text-base px-4 py-2 font-semibold shadow-lg">
                      <span className="mr-2">🌿</span>
                      {gitState.currentBranch}
                    </Badge>
                  </div>

                  {/* Branches */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200/50 dark:border-green-700/50">
                    <h3 className="font-bold mb-3 text-base md:text-lg flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      All Branches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {gitState.branches.map(branch => (
                        <Badge 
                          key={branch}
                          className={`text-sm px-3 py-1.5 font-medium shadow-sm ${
                            branch === gitState.currentBranch 
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg" 
                              : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600"
                          }`}
                        >
                          <span className="mr-1">
                            {branch === gitState.currentBranch ? "🌟" : "🌿"}
                          </span>
                          {branch}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Working Directory */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
                    <h3 className="font-bold mb-3 text-base md:text-lg flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                      Working Directory
                    </h3>
                    <div className="space-y-2">
                      {gitState.workingDirectory.map(file => (
                        <div key={file} className="flex items-center justify-between bg-white/70 dark:bg-slate-700/70 p-3 rounded-lg border border-slate-200/50 dark:border-slate-600/50">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">📄</span>
                            <span className="font-mono text-sm md:text-base text-slate-700 dark:text-slate-300 break-all">{file}</span>
                          </div>
                          {gitState.stagingArea.includes(file) && (
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 shadow-sm">
                              <span className="mr-1">✓</span>
                              staged
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Commits */}
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-violet-200/50 dark:border-violet-700/50">
                    <h3 className="font-bold mb-3 text-base md:text-lg flex items-center gap-2">
                      <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
                      Recent Commits
                    </h3>
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                      {gitState.commits.slice(-3).reverse().map((commit, index) => (
                        <div key={commit.id} className="bg-white/70 dark:bg-slate-700/70 p-3 rounded-lg border border-slate-200/50 dark:border-slate-600/50">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm">🔗</span>
                            <code className="font-mono text-xs text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/30 px-2 py-1 rounded">
                              {commit.id}
                            </code>
                            {index === 0 && (
                              <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs px-2 py-0.5">
                                HEAD
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium break-words">
                            {commit.message}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {new Date(commit.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Commands */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl ring-1 ring-slate-200/50 dark:ring-slate-700/50">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-t-lg border-b border-slate-200/50 dark:border-slate-600/50">
                <CardTitle className="text-xl md:text-2xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent font-bold">
                  Quick Commands
                </CardTitle>
                <CardDescription className="text-base text-slate-600 dark:text-slate-300 font-medium">
                  Click to execute common Git commands instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => executeCommand('git status')} 
                    className="h-12 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-800/30 dark:hover:to-emerald-800/30 text-green-700 dark:text-green-300 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="mr-2">📊</span>
                    <span className="text-xs">git status</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => executeCommand('git add .')} 
                    className="h-12 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-800/30 dark:hover:to-cyan-800/30 text-blue-700 dark:text-blue-300 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="mr-2">➕</span>
                    <span className="text-xs">git add .</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => executeCommand('git commit -m "Update files"')} 
                    className="h-12 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-700 hover:from-purple-100 hover:to-violet-100 dark:hover:from-purple-800/30 dark:hover:to-violet-800/30 text-purple-700 dark:text-purple-300 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="mr-2">💾</span>
                    <span className="text-xs">git commit</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => executeCommand('git log')} 
                    className="h-12 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-700 hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-800/30 dark:hover:to-amber-800/30 text-orange-700 dark:text-orange-300 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="mr-2">📜</span>
                    <span className="text-xs">git log</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => executeCommand('git branch')} 
                    className="h-12 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200 dark:border-teal-700 hover:from-teal-100 hover:to-cyan-100 dark:hover:from-teal-800/30 dark:hover:to-cyan-800/30 text-teal-700 dark:text-teal-300 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="mr-2">🌿</span>
                    <span className="text-xs">git branch</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => executeCommand('git branch feature')} 
                    className="h-12 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-700 hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-800/30 dark:hover:to-rose-800/30 text-pink-700 dark:text-pink-300 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="mr-2">🆕</span>
                    <span className="text-xs">new branch</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => executeCommand('git checkout feature')} 
                    className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-800/30 dark:hover:to-purple-800/30 text-indigo-700 dark:text-indigo-300 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="mr-2">🔄</span>
                    <span className="text-xs">checkout</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => executeCommand('git remote -v')} 
                    className="h-12 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 border-slate-200 dark:border-slate-700 hover:from-slate-100 hover:to-gray-100 dark:hover:from-slate-800/30 dark:hover:to-gray-800/30 text-slate-700 dark:text-slate-300 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <span className="mr-2">🌐</span>
                    <span className="text-xs">git remote</span>
                  </Button>
                </div>
                
                {/* Command Categories */}
                <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-600/50">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs px-3 py-1">
                      <span className="mr-1">📊</span>
                      Status & Info
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-3 py-1">
                      <span className="mr-1">💾</span>
                      Staging & Commits
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs px-3 py-1">
                      <span className="mr-1">🌿</span>
                      Branching
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 text-xs px-3 py-1">
                      <span className="mr-1">🌐</span>
                      Remote
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="mt-0">
            <GitLessons />
          </TabsContent>

          <TabsContent value="commands" className="mt-0">
            <GitCommands />
          </TabsContent>

          <TabsContent value="visualization" className="mt-0">
            <GitVisualization onNavigateToLesson={handleNavigateToLesson} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
