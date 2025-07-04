'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CommitNode {
  id: string;
  message: string;
  branch: string;
  x: number;
  y: number;
  parents: string[];
}

interface GitVisualizationProps {
  onNavigateToLesson?: (lessonId: string) => void;
}

export function GitVisualization({ onNavigateToLesson }: GitVisualizationProps) {
  const [selectedView, setSelectedView] = useState<'workflow' | 'tree' | 'branching'>('workflow');

  // Sample commit tree data
  const commits: CommitNode[] = [
    { id: 'a1b2c3d', message: 'Initial commit', branch: 'main', x: 100, y: 50, parents: [] },
    { id: 'e4f5g6h', message: 'Add README', branch: 'main', x: 100, y: 100, parents: ['a1b2c3d'] },
    { id: 'i7j8k9l', message: 'Create feature branch', branch: 'feature', x: 200, y: 150, parents: ['e4f5g6h'] },
    { id: 'm1n2o3p', message: 'Add new feature', branch: 'feature', x: 200, y: 200, parents: ['i7j8k9l'] },
    { id: 'q4r5s6t', message: 'Fix bug in main', branch: 'main', x: 100, y: 150, parents: ['e4f5g6h'] },
    { id: 'u7v8w9x', message: 'Merge feature', branch: 'main', x: 100, y: 250, parents: ['q4r5s6t', 'm1n2o3p'] },
  ];

  const WorkflowDiagram = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Git Workflow Visualization</CardTitle>
          <CardDescription>Understanding the Git workflow and file states</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mobile Layout - Vertical Stack */}
          <div className="block lg:hidden">
            <div className="space-y-8 py-4">
              {/* Step 1 - Working Directory */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-sm bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
                  <div className="text-center">
                    <h3 className="font-bold text-red-700 dark:text-red-300 mb-3">📁 Working Directory</h3>
                    <div className="space-y-2">
                      <div className="bg-white dark:bg-slate-700 p-2 rounded-lg text-sm">📄 index.html</div>
                      <div className="bg-white dark:bg-slate-700 p-2 rounded-lg text-sm">📄 style.css</div>
                      <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg text-sm">📄 script.js (modified)</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center my-4">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">git add .</div>
                  <div className="w-0.5 h-6 bg-blue-500 mt-2"></div>
                  <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-blue-500"></div>
                </div>
              </div>

              {/* Step 2 - Staging Area */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-sm bg-yellow-50 dark:bg-yellow-900/10 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                  <div className="text-center">
                    <h3 className="font-bold text-yellow-700 dark:text-yellow-300 mb-3">📋 Staging Area</h3>
                    <div className="space-y-2">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-sm">📄 script.js (staged)</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Ready for commit</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center my-4">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">git commit -m "message"</div>
                  <div className="w-0.5 h-6 bg-green-500 mt-2"></div>
                  <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-green-500"></div>
                </div>
              </div>

              {/* Step 3 - Repository */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-sm bg-green-50 dark:bg-green-900/10 border-2 border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="text-center">
                    <h3 className="font-bold text-green-700 dark:text-green-300 mb-3">🗂️ Local Repository</h3>
                    <div className="space-y-2">
                      <div className="bg-white dark:bg-slate-700 p-2 rounded-lg text-sm">📦 commit: abc123</div>
                      <div className="bg-white dark:bg-slate-700 p-2 rounded-lg text-sm">📦 commit: def456</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center my-4">
                  <div className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">git push origin main</div>
                  <div className="w-0.5 h-6 bg-purple-500 mt-2"></div>
                  <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-purple-500"></div>
                </div>
              </div>

              {/* Step 4 - Remote Repository */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-sm bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <div className="text-center">
                    <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-3">☁️ Remote Repository</h3>
                    <div className="space-y-2">
                      <div className="bg-white dark:bg-slate-700 p-2 rounded-lg text-sm">🌐 origin/main</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">GitHub, GitLab, etc.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Horizontal Flow */}
          <div className="hidden lg:block">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8">
              <div className="relative overflow-x-auto" style={{ minHeight: '350px', minWidth: '800px' }}>
                
                {/* Working Directory */}
                <div className="absolute top-0 left-0 w-44 bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800 rounded-xl p-3">
                  <h3 className="font-bold text-red-700 dark:text-red-300 mb-3 text-center text-sm">📁 Working Directory</h3>
                  <div className="space-y-2">
                    <div className="bg-white dark:bg-slate-700 p-2 rounded text-xs">📄 index.html</div>
                    <div className="bg-white dark:bg-slate-700 p-2 rounded text-xs">📄 style.css</div>
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded text-xs">📄 script.js</div>
                  </div>
                </div>

                {/* Arrow 1 */}
                <div className="absolute top-16 left-48 flex items-center">
                  <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">git add</div>
                  <div className="w-12 h-0.5 bg-blue-500"></div>
                  <div className="w-0 h-0 border-l-4 border-l-blue-500 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                </div>

                {/* Staging Area */}
                <div className="absolute top-0 left-78 w-44 bg-yellow-50 dark:bg-yellow-900/10 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-3">
                  <h3 className="font-bold text-yellow-700 dark:text-yellow-300 mb-3 text-center text-sm">📋 Staging Area</h3>
                  <div className="space-y-2">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded text-xs">📄 script.js</div>
                    <div className="text-xs text-slate-500 text-center">(staged)</div>
                  </div>
                </div>

                {/* Arrow 2 */}
                <div className="absolute top-16 left-[500px] flex items-center">
                  <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">git commit</div>
                  <div className="w-12 h-0.5 bg-green-500"></div>
                  <div className="w-0 h-0 border-l-4 border-l-green-500 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                </div>

                {/* Local Repository */}
                <div className="absolute top-0 left-[640px] w-44 bg-green-50 dark:bg-green-900/10 border-2 border-green-200 dark:border-green-800 rounded-xl p-3">
                  <h3 className="font-bold text-green-700 dark:text-green-300 mb-3 text-center text-sm">🗂️ Repository</h3>
                  <div className="space-y-2">
                    <div className="bg-white dark:bg-slate-700 p-2 rounded text-xs">📦 abc123</div>
                    <div className="bg-white dark:bg-slate-700 p-2 rounded text-xs">📦 def456</div>
                  </div>
                </div>

                {/* Vertical Arrow */}
                <div className="absolute top-[160px] left-[725px] flex flex-col items-center">
                  <div className="w-0.5 h-12 bg-purple-500"></div>
                  <div className="w-0 h-0 border-t-4 border-t-purple-500 border-l-2 border-l-transparent border-r-2 border-r-transparent"></div>
                </div>

                {/* Push/Pull Label */}
                <div className="absolute top-[140px] left-[680px] bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  git push/pullsdf
                </div>

                {/* Remote Repository */}
                <div className="absolute top-[220px] left-[640px] w-44 bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-3">
                  <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-3 text-center text-sm">☁️ Remote Repo</h3>
                  <div className="space-y-2">
                    <div className="bg-white dark:bg-slate-700 p-2 rounded text-xs text-center">🌐 origin/main</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 bg-white dark:bg-slate-700 border rounded-xl p-4">
            <h4 className="font-bold mb-3">Git Workflow Steps:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-200 rounded-full flex-shrink-0"></div>
                <span><strong>Working Directory:</strong> Where you edit files</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-200 rounded-full flex-shrink-0"></div>
                <span><strong>Staging Area:</strong> Files ready to commit</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-200 rounded-full flex-shrink-0"></div>
                <span><strong>Repository:</strong> Committed snapshots</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-200 rounded-full flex-shrink-0"></div>
                <span><strong>Remote:</strong> Shared repository online</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CommitTree = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Commit Tree Visualization</CardTitle>
          <CardDescription>Visual representation of commit history and branches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-slate-50 dark:bg-slate-800 p-6 rounded-lg overflow-x-auto">
            <div className="w-full min-w-[600px] h-80 relative">
              <svg width="100%" height="100%" viewBox="0 0 600 320" className="w-full h-full">
                {/* Draw connections between commits */}
                {commits.map(commit => 
                  commit.parents.map(parentId => {
                    const parent = commits.find(c => c.id === parentId);
                    if (parent) {
                      return (
                        <line
                          key={`${commit.id}-${parentId}`}
                          x1={parent.x}
                          y1={parent.y}
                          x2={commit.x}
                          y2={commit.y}
                          stroke={commit.branch === 'main' ? '#3b82f6' : '#10b981'}
                          strokeWidth="3"
                          className="drop-shadow-sm"
                        />
                      );
                    }
                    return null;
                  })
                )}
                
                {/* Draw commit nodes */}
                {commits.map(commit => (
                  <g key={commit.id}>
                    <circle
                      cx={commit.x}
                      cy={commit.y}
                      r="8"
                      fill={commit.branch === 'main' ? '#3b82f6' : '#10b981'}
                      stroke="white"
                      strokeWidth="3"
                      className="drop-shadow-md"
                    />
                    <text
                      x={commit.x + 15}
                      y={commit.y + 5}
                      fontSize="12"
                      fill="currentColor"
                      className="text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {commit.message}
                    </text>
                    <text
                      x={commit.x + 15}
                      y={commit.y - 8}
                      fontSize="10"
                      fill="currentColor"
                      className="text-slate-500 dark:text-slate-400 font-mono"
                    >
                      {commit.id}
                    </text>
                  </g>
                ))}
              </svg>
              
              {/* Branch labels */}
              <div className="absolute top-4 right-4 space-y-2 bg-white dark:bg-slate-700 p-3 rounded-lg border shadow-lg text-sm">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">Branches:</h4>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                  <span className="font-medium">main</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                  <span className="font-medium">feature</span>
                </div>
              </div>
            </div>
            
            {/* Commit Details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {commits.map(commit => (
                <div key={commit.id} className="bg-white dark:bg-slate-700 p-3 rounded-lg border shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${commit.branch === 'main' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                    <code className="text-xs font-mono bg-slate-100 dark:bg-slate-600 px-2 py-1 rounded">
                      {commit.id}
                    </code>
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                    {commit.message}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Branch: {commit.branch}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const BranchingStrategies = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Git Flow */}
        <Card>
          <CardHeader>
            <CardTitle>Git Flow Strategy</CardTitle>
            <CardDescription>A branching model for larger projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <span className="font-medium">main</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Production ready code</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <span className="font-medium">develop</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Integration branch</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <span className="font-medium">feature/*</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">New features</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <span className="font-medium">hotfix/*</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Critical fixes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <span className="font-medium">release/*</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Release preparation</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GitHub Flow */}
        <Card>
          <CardHeader>
            <CardTitle>GitHub Flow Strategy</CardTitle>
            <CardDescription>Simplified workflow for continuous deployment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <span className="font-medium">main</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Always deployable</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <span className="font-medium">feature-branch</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Work on features</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Workflow Steps:</h4>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <p>1. Create branch from main</p>
                  <p>2. Make changes and commit</p>
                  <p>3. Open pull request</p>
                  <p>4. Review and merge</p>
                  <p>5. Deploy main branch</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Merge vs Rebase */}
      <Card>
        <CardHeader>
          <CardTitle>Merge vs Rebase Visualization</CardTitle>
          <CardDescription>Understanding different ways to integrate changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Merge */}
            <div>
              <h3 className="font-semibold mb-4 text-center">Merge Strategy</h3>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="font-mono">A - B - C - M</span>
                    <span className="text-slate-600 dark:text-slate-400">(main)</span>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="font-mono">D - E</span>
                    <span className="text-slate-600 dark:text-slate-400">(feature)</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    ✓ Creates a merge commit (M) that combines both branches<br/>
                    ✓ Preserves complete history<br/>
                    ✓ Shows when features were integrated
                  </div>
                </div>
              </div>
            </div>

            {/* Rebase */}
            <div>
              <h3 className="font-semibold mb-4 text-center">Rebase Strategy</h3>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="font-mono">A - B - C - D&apos; - E&apos;</span>
                    <span className="text-slate-600 dark:text-slate-400">(main)</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    ✓ Replays feature commits (D&apos;, E&apos;) on top of main<br/>
                    ✓ Creates linear history<br/>
                    ✓ Cleaner commit timeline
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* When to use each */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
            <h4 className="font-semibold mb-2">When to use each approach:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-blue-600">Use Merge when:</h5>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Working on a team</li>
                  <li>Want to preserve context</li>
                  <li>Feature branches are shared</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-green-600">Use Rebase when:</h5>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Working on private branches</li>
                  <li>Want clean linear history</li>
                  <li>Preparing for code review</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      
      {/* View Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Git Visualization</CardTitle>
          <CardDescription>Interactive diagrams to understand Git concepts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedView === 'workflow' ? 'default' : 'outline'}
              onClick={() => setSelectedView('workflow')}
            >
              Git Workflow
            </Button>
            <Button
              variant={selectedView === 'tree' ? 'default' : 'outline'}
              onClick={() => setSelectedView('tree')}
            >
              Commit Tree
            </Button>
            <Button
              variant={selectedView === 'branching' ? 'default' : 'outline'}
              onClick={() => setSelectedView('branching')}
            >
              Branching Strategies
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Render selected view */}
      {selectedView === 'workflow' && <WorkflowDiagram />}
      {selectedView === 'tree' && <CommitTree />}
      {selectedView === 'branching' && <BranchingStrategies />}

      {/* Interactive Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Learning</CardTitle>
          <CardDescription>Practice these concepts in our interactive lessons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-start hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left"
              onClick={() => onNavigateToLesson?.('branching')}
            >
              <span className="font-semibold text-blue-600 mb-2">🌿 Practice Branching</span>
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed overflow-hidden text-ellipsis whitespace-nowrap w-full">
                Learn to create and switch between branches interactively
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-start hover:bg-green-50 dark:hover:bg-green-900/20 text-left"
              onClick={() => onNavigateToLesson?.('git-basics')}
            >
              <span className="font-semibold text-green-600 mb-2">📦 Try Git Basics</span>
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed overflow-hidden text-ellipsis whitespace-nowrap w-full">
                Master the fundamental Git workflow with hands-on practice
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-start hover:bg-purple-50 dark:hover:bg-purple-900/20 text-left"
              onClick={() => onNavigateToLesson?.('remote-repos')}
            >
              <span className="font-semibold text-purple-600 mb-2">🌐 Remote Repositories</span>
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed overflow-hidden text-ellipsis whitespace-nowrap w-full">
                Learn collaboration with push, pull, and remote workflows
              </span>
            </Button>
          </div>
          
          {/* Additional Practice Options */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
            <h3 className="font-semibold mb-2">🎯 Ready to Practice?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
              Each interactive lesson includes step-by-step guidance with visual feedback showing exactly what happens when you execute Git commands.
            </p>
            <Button 
              onClick={() => onNavigateToLesson?.('git-basics')}
              className="w-full sm:w-auto"
            >
              Start with Git Basics →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
