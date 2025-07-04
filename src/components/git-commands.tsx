'use client';

import { useState } from 'react';
import { Search, Filter, BookOpen, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitCommandExplainer } from './git-command-explainer';
import { GitExplainer, GitCommandExplanation } from '@/lib/git-explainer';

export function GitCommands() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const allCommands = GitExplainer.getAllCommands();
  
  const filteredCommands = allCommands.filter(cmd => {
    const matchesSearch = !searchQuery || 
      cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || cmd.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = ['all', 'basic', 'branching', 'remote', 'history', 'advanced', 'collaboration', 'maintenance'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'branching': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'remote': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'history': return 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'collaboration': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400';
      case 'maintenance': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="explainer" className="w-full">
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-2 mb-6 shadow-lg border-0">
          <TabsList className="grid w-full grid-cols-2 bg-transparent">
            <TabsTrigger 
              value="explainer" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
            >
              <Zap className="h-4 w-4 mr-2" />
              AI Explainer
            </TabsTrigger>
            <TabsTrigger 
              value="reference" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Command Reference
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="explainer">
          <GitCommandExplainer />
        </TabsContent>

        <TabsContent value="reference" className="space-y-6">
          {/* Filters */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Commands
              </CardTitle>
              <CardDescription>
                Browse {allCommands.length} Git commands by category and difficulty
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search commands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category and Difficulty Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="text-xs capitalize"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <div className="flex flex-wrap gap-2">
                    {difficulties.map(difficulty => (
                      <Button
                        key={difficulty}
                        variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className="text-xs capitalize"
                      >
                        {difficulty}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-400">
                Showing {filteredCommands.length} of {allCommands.length} commands
              </div>
            </CardContent>
          </Card>

          {/* Commands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommands.map((cmd, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getCategoryColor(cmd.category)} variant="secondary">
                      {cmd.category}
                    </Badge>
                    <Badge className={getDifficultyColor(cmd.difficulty)} variant="secondary">
                      {cmd.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="font-mono text-lg text-blue-600 dark:text-blue-400">
                    {cmd.command}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {cmd.shortDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Use Case */}
                  <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                    <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      When to use:
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {cmd.useCase}
                    </p>
                  </div>

                  {/* Example */}
                  <div className="bg-black p-2 rounded text-xs">
                    <code className="text-green-400 font-mono">
                      $ {cmd.example}
                    </code>
                  </div>

                  {/* Common Flags */}
                  {cmd.commonFlags.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                        Common options:
                      </h4>
                      <div className="space-y-1">
                        {cmd.commonFlags.slice(0, 2).map((flag, flagIndex) => (
                          <div key={flagIndex} className="text-xs">
                            <code className="bg-slate-200 dark:bg-slate-600 px-1 rounded font-mono text-blue-600 dark:text-blue-400">
                              {flag.flag}
                            </code>
                            <span className="text-slate-600 dark:text-slate-400 ml-2">
                              {flag.description}
                            </span>
                          </div>
                        ))}
                        {cmd.commonFlags.length > 2 && (
                          <div className="text-xs text-slate-500">
                            +{cmd.commonFlags.length - 2} more options
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCommands.length === 0 && (
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="pt-6 text-center">
                <div className="text-yellow-800 dark:text-yellow-400">
                  <Search className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold">No commands found</h3>
                  <p className="text-sm mt-1">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
