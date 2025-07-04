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
import { Terminal, Play, BookOpen, Command, BarChart3, GitBranch, FileText, Clock, CheckCircle } from 'lucide-react';

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
    }, 300); // Reduced delay for better responsiveness
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" suppressHydrationWarning>
      
      {/* Modern Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-pink-500/5 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Terminal className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
              Git Playground
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
              Master Git commands through interactive practice with real-time feedback and beautiful visualizations
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                <Terminal className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Live Terminal</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Visual Feedback</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Safe Environment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Component with Sticky Navigation */}
      <Tabs value={selectedSection} onValueChange={setSelectedSection} className="w-full">
        {/* Sticky Tab Navigation */}
        <div className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <TabsList className="grid w-full grid-cols-4 h-14 bg-slate-100/50 dark:bg-slate-800/50">
              <TabsTrigger 
                value="playground" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white dark:data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-blue-600 dark:data-[state=active]:to-purple-600 dark:data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Playground</span>
                <span className="sm:hidden font-medium">Play</span>
              </TabsTrigger>
              <TabsTrigger 
                value="lessons" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white dark:data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-green-600 dark:data-[state=active]:to-emerald-600 dark:data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Lessons</span>
                <span className="sm:hidden font-medium">Learn</span>
              </TabsTrigger>
              <TabsTrigger 
                value="commands" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white dark:data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-orange-600 dark:data-[state=active]:to-amber-600 dark:data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Command className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Commands</span>
                <span className="sm:hidden font-medium">Cmd</span>
              </TabsTrigger>
              <TabsTrigger 
                value="visualization" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white dark:data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-purple-600 dark:data-[state=active]:to-pink-600 dark:data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Visualization</span>
                <span className="sm:hidden font-medium">Visual</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <TabsContent value="playground" className="space-y-8 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Enhanced Terminal */}
              <Card className="overflow-hidden border-0 shadow-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <Terminal className="w-5 h-5 text-green-400" />
                      <CardTitle className="text-lg font-bold text-green-400">
                        git-playground
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>LIVE</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div 
                    ref={terminalRef}
                    className="h-96 bg-slate-900 text-green-400 p-4 font-mono text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
                  >
                    {commandHistory.map((cmd, index) => (
                      <div key={index} className="mb-3 group">
                        <div className="flex items-center gap-2 text-blue-400 break-all">
                          <span className="text-green-400 font-bold">➜</span>
                          <span className="text-cyan-400 font-medium">git-playground</span>
                          <span className="text-blue-400">git:(</span>
                          <span className="text-yellow-400 font-medium">{gitState.currentBranch}</span>
                          <span className="text-blue-400">)</span>
                          <span className="text-white font-bold">$</span>
                          <span className="text-white">{cmd.command}</span>
                        </div>
                        <div className={`${cmd.success ? 'text-green-300' : 'text-red-400'} whitespace-pre-wrap break-words ml-4 mt-1 opacity-90 leading-relaxed`}>
                          {cmd.output}
                        </div>
                      </div>
                    ))}
                    
                    {/* Current prompt */}
                    <div className="flex items-center gap-2 text-blue-400">
                      <span className="text-green-400 font-bold">➜</span>
                      <span className="text-cyan-400 font-medium">git-playground</span>
                      <span className="text-blue-400">git:(</span>
                      <span className="text-yellow-400 font-medium">{gitState.currentBranch}</span>
                      <span className="text-blue-400">)</span>
                      <span className="text-white font-bold">$</span>
                      {isClient && isTyping && (
                        <span className="text-yellow-400 animate-pulse font-medium">Processing...</span>
                      )}
                      {isClient && !isTyping && (
                        <span className="w-2 h-4 bg-green-400 animate-pulse ml-1"></span>
                      )}
                    </div>
                  </div>
                  
                  {/* Command Input */}
                  <div className="p-4 bg-slate-800 border-t border-slate-700">
                    <div className="flex gap-3">
                      <div className="flex items-center gap-2 text-green-400 font-mono text-sm font-bold">
                        <span>$</span>
                      </div>
                      <Input
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isTyping && executeCommand(command)}
                        placeholder="Type your Git command here..."
                        disabled={isTyping}
                        className="font-mono bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-400 focus:ring-green-400/20"
                      />
                      <Button 
                        onClick={() => executeCommand(command)} 
                        disabled={isTyping || !command.trim()}
                        className="px-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isClient && isTyping ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Running</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            <span>Execute</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Modern Repository State */}
              <Card className="overflow-hidden border-0 shadow-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
                  <div className="flex items-center gap-3">
                    <GitBranch className="w-6 h-6" />
                    <div>
                      <CardTitle className="text-lg font-bold">Repository State</CardTitle>
                      <CardDescription className="text-purple-100">
                        Live visualization of your Git repository
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                  
                  {/* Current Branch */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">Current Branch</h3>
                    </div>
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 text-sm font-medium shadow-lg">
                      {gitState.currentBranch}
                    </Badge>
                  </div>

                  {/* All Branches */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">All Branches</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {gitState.branches.map(branch => (
                        <Badge 
                          key={branch}
                          variant={branch === gitState.currentBranch ? "default" : "secondary"}
                          className={`px-3 py-1 text-sm ${
                            branch === gitState.currentBranch 
                              ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md" 
                              : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {branch === gitState.currentBranch ? "★ " : ""}{branch}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Working Directory */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">Working Directory</h3>
                    </div>
                    <div className="space-y-2">
                      {gitState.workingDirectory.map(file => (
                        <div key={file} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-slate-500" />
                            <span className="font-mono text-sm text-slate-700 dark:text-slate-300">{file}</span>
                          </div>
                          {gitState.stagingArea.includes(file) && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs px-2 py-1">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Staged
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Commits */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">Recent Commits</h3>
                    </div>
                    <div className="space-y-3">
                      {gitState.commits.slice(-3).reverse().map((commit, index) => (
                        <div key={commit.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-2 mb-2">
                            <code className="text-xs font-mono bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                              {commit.id}
                            </code>
                            {index === 0 && (
                              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs px-2 py-0.5">
                                HEAD
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-1">
                            {commit.message}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(commit.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Modern Quick Commands */}
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4">
                <div className="flex items-center gap-3">
                  <Command className="w-6 h-6" />
                  <div>
                    <CardTitle className="text-lg font-bold">Quick Commands</CardTitle>
                    <CardDescription className="text-cyan-100">
                      Click to execute common Git commands instantly
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { cmd: 'git status', label: 'Status', icon: BarChart3, color: 'from-green-500 to-emerald-500' },
                    { cmd: 'git add .', label: 'Add All', icon: CheckCircle, color: 'from-blue-500 to-cyan-500' },
                    { cmd: 'git commit -m "Update files"', label: 'Commit', icon: CheckCircle, color: 'from-purple-500 to-violet-500' },
                    { cmd: 'git log', label: 'Log', icon: Clock, color: 'from-orange-500 to-amber-500' },
                    { cmd: 'git branch', label: 'Branches', icon: GitBranch, color: 'from-teal-500 to-cyan-500' },
                    { cmd: 'git branch feature', label: 'New Branch', icon: GitBranch, color: 'from-pink-500 to-rose-500' },
                    { cmd: 'git checkout feature', label: 'Checkout', icon: GitBranch, color: 'from-indigo-500 to-purple-500' },
                    { cmd: 'git remote -v', label: 'Remotes', icon: GitBranch, color: 'from-slate-500 to-gray-500' },
                  ].map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => executeCommand(item.cmd)}
                      disabled={isTyping}
                      className={`h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-r ${item.color} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{item.label}</span>
                    </Button>
                  ))}
                </div>
                
                {/* Command Categories */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex flex-wrap justify-center gap-3">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Status & Info
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Staging & Commits
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                      <GitBranch className="w-3 h-3 mr-1" />
                      Branching
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                      <GitBranch className="w-3 h-3 mr-1" />
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
        </div>
      </Tabs>
    </div>
  );
}
