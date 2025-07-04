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

export function GitVisualization() {
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
          <div className="relative bg-slate-50 dark:bg-slate-800 p-8 rounded-lg">
            
            {/* Working Directory */}
            <div className="absolute top-4 left-4 w-48 h-32 bg-red-100 dark:bg-red-900/20 border-2 border-red-300 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">Working Directory</h3>
              <div className="space-y-1">
                <div className="text-sm bg-white dark:bg-slate-700 p-1 rounded">📄 index.html</div>
                <div className="text-sm bg-white dark:bg-slate-700 p-1 rounded">📄 style.css</div>
                <div className="text-sm bg-yellow-100 dark:bg-yellow-900/20 p-1 rounded">📄 script.js (modified)</div>
              </div>
            </div>

            {/* Arrow 1 */}
            <div className="absolute top-20 left-56 flex items-center">
              <div className="text-sm bg-blue-500 text-white px-2 py-1 rounded">git add</div>
              <div className="w-8 h-0.5 bg-blue-500 ml-2"></div>
              <div className="w-0 h-0 border-l-4 border-l-blue-500 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
            </div>

            {/* Staging Area */}
            <div className="absolute top-4 left-80 w-48 h-32 bg-yellow-100 dark:bg-yellow-900/20 border-2 border-yellow-300 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Staging Area</h3>
              <div className="space-y-1">
                <div className="text-sm bg-green-100 dark:bg-green-900/20 p-1 rounded">📄 script.js (staged)</div>
              </div>
            </div>

            {/* Arrow 2 */}
            <div className="absolute top-20 left-[540px] flex items-center">
              <div className="text-sm bg-green-500 text-white px-2 py-1 rounded">git commit</div>
              <div className="w-8 h-0.5 bg-green-500 ml-2"></div>
              <div className="w-0 h-0 border-l-4 border-l-green-500 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
            </div>

            {/* Repository */}
            <div className="absolute top-4 right-4 w-48 h-32 bg-green-100 dark:bg-green-900/20 border-2 border-green-300 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Repository</h3>
              <div className="space-y-1">
                <div className="text-sm bg-white dark:bg-slate-700 p-1 rounded">📦 Commit: abc123</div>
                <div className="text-sm bg-white dark:bg-slate-700 p-1 rounded">📦 Commit: def456</div>
              </div>
            </div>

            {/* Remote Repository */}
            <div className="absolute bottom-4 right-4 w-48 h-24 bg-blue-100 dark:bg-blue-900/20 border-2 border-blue-300 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Remote Repository</h3>
              <div className="text-sm bg-white dark:bg-slate-700 p-1 rounded">🌐 origin/main</div>
            </div>

            {/* Push/Pull arrows */}
            <div className="absolute bottom-12 right-56 flex flex-col items-center">
              <div className="text-xs bg-purple-500 text-white px-2 py-1 rounded mb-1">git push</div>
              <div className="w-0.5 h-8 bg-purple-500"></div>
              <div className="text-xs bg-purple-500 text-white px-2 py-1 rounded mt-1">git pull</div>
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
          <div className="relative bg-slate-50 dark:bg-slate-800 p-8 rounded-lg h-96 overflow-auto">
            <svg width="400" height="300" className="absolute inset-0">
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
                        strokeWidth="2"
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
                    strokeWidth="2"
                  />
                  <text
                    x={commit.x + 15}
                    y={commit.y + 5}
                    fontSize="12"
                    fill="currentColor"
                  >
                    {commit.message}
                  </text>
                </g>
              ))}
            </svg>
            
            {/* Branch labels */}
            <div className="absolute top-4 right-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm">main branch</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm">feature branch</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const BranchingStrategies = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Git Flow */}
        <Card>
          <CardHeader>
            <CardTitle>Git Flow Strategy</CardTitle>
            <CardDescription>A branching model for larger projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">main</span> - Production ready code
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">develop</span> - Integration branch
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">feature/*</span> - New features
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium">hotfix/*</span> - Critical fixes
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium">release/*</span> - Release preparation
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
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">main</span> - Always deployable
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">feature-branch</span> - Work on features
                </div>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <p>1. Create branch from main</p>
                <p>2. Make changes and commit</p>
                <p>3. Open pull request</p>
                <p>4. Review and merge</p>
                <p>5. Deploy main branch</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Merge */}
            <div>
              <h3 className="font-semibold mb-4 text-center">Merge</h3>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>A - B - C - M (main)</span>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>D - E (feature)</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    Creates a merge commit (M) that combines both branches
                  </div>
                </div>
              </div>
            </div>

            {/* Rebase */}
            <div>
              <h3 className="font-semibold mb-4 text-center">Rebase</h3>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>A - B - C - D' - E' (main)</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    Replays feature commits (D', E') on top of main
                  </div>
                </div>
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
          <CardDescription>Try these concepts in the playground</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <span className="font-semibold">Practice Branching</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Create and switch between branches
              </span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <span className="font-semibold">Try Merging</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Merge feature branches into main
              </span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <span className="font-semibold">Resolve Conflicts</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Learn to handle merge conflicts
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
