'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Zap, Terminal, Code, Star, Clock, Users, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitCommandExplainer } from './git-command-explainer';
import { GitExplainer } from '@/lib/git-explainer';

interface GitCommandsProps {
  initialSearch?: string;
}

export function GitCommands({ initialSearch = '' }: GitCommandsProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Update search query when initialSearch prop changes
  useEffect(() => {
    if (initialSearch !== searchQuery) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch, searchQuery]);

  const allCommands = GitExplainer.getAllCommands();
  
  const filteredCommands = allCommands.filter(cmd => {
    const matchesSearch = !searchQuery || 
      cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || cmd.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = [
    { id: 'all', label: 'All', icon: Terminal },
    { id: 'basic', label: 'Basic', icon: Star },
    { id: 'branching', label: 'Branching', icon: Code },
    { id: 'remote', label: 'Remote', icon: Users },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'advanced', label: 'Advanced', icon: Settings },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'maintenance', label: 'Maintenance', icon: Settings }
  ];
  
  const difficulties = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'intermediate': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'advanced': return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      default: return 'bg-gradient-to-r from-slate-500 to-gray-500 text-white';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'branching': return 'bg-gradient-to-r from-purple-500 to-violet-500 text-white';
      case 'remote': return 'bg-gradient-to-r from-orange-500 to-amber-500 text-white';
      case 'history': return 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white';
      case 'advanced': return 'bg-gradient-to-r from-red-500 to-rose-500 text-white';
      case 'collaboration': return 'bg-gradient-to-r from-pink-500 to-rose-500 text-white';
      case 'maintenance': return 'bg-gradient-to-r from-slate-500 to-gray-500 text-white';
      default: return 'bg-gradient-to-r from-slate-400 to-slate-500 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryObj = categories.find(cat => cat.id === category);
    return categoryObj?.icon || Terminal;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto py-6">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-orange-800 to-amber-800 dark:from-white dark:via-orange-200 dark:to-amber-200 bg-clip-text text-transparent mb-4">
            Git Command Reference
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto px-4">
            Comprehensive guide to Git commands with AI-powered explanations and interactive examples
          </p>
        </div>

        <Tabs defaultValue="explainer" className="w-full">
          <div className=" mb-8 ">
            <TabsList className="grid w-full grid-cols-2 bg-transparent h-12 sm:h-14 px-2">
              <TabsTrigger 
                value="explainer" 
                className="flex items-center justify-center gap-2 sm:gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white dark:data-[state=active]:text-white transition-all duration-300 text-sm sm:text-base font-medium px-2 sm:px-4"
              >
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="hidden xs:inline">AI Command Explainer</span>
                <span className="xs:hidden">AI Explainer</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reference" 
                className="flex items-center justify-center gap-2 sm:gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white dark:data-[state=active]:text-white transition-all duration-300 text-sm sm:text-base font-medium px-2 sm:px-4"
              >
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="hidden xs:inline">Command Reference</span>
                <span className="xs:hidden">Reference</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="explainer" className="px-0">
            <GitCommandExplainer />
          </TabsContent>

          <TabsContent value="reference" className="space-y-6 sm:space-y-8 px-0">
            {/* Enhanced Filters */}
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm pt-0">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200/50 dark:border-slate-600/50 pt-2">
                <div className="flex items-start sm:items-center gap-3">
                  <Filter className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600 dark:text-slate-400 flex-shrink-0 mt-1 sm:mt-0" />
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                      Filter & Search Commands
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                      Explore {allCommands.length} Git commands organized by category and difficulty level
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  <Input
                    placeholder="Search commands, descriptions, or use cases..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20"
                  />
                </div>

                {/* Category Filters */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                    {categories.map(category => {
                      const IconComponent = category.icon;
                      return (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedCategory(category.id)}
                          className={`h-8 sm:h-10 flex items-center justify-center gap-1 sm:gap-2 text-xs font-medium transition-all duration-300 ${
                            selectedCategory === category.id 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl' 
                              : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <IconComponent className="w-3 h-3 flex-shrink-0" />
                          <span className="hidden sm:inline truncate">{category.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty Filters */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Difficulty Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {difficulties.map(difficulty => (
                      <Button
                        key={difficulty.id}
                        variant={selectedDifficulty === difficulty.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedDifficulty(difficulty.id)}
                        className={`h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-300 ${
                          selectedDifficulty === difficulty.id 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl' 
                            : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {difficulty.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Results Counter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700 gap-3 sm:gap-0">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredCommands.length}</span> of <span className="font-semibold">{allCommands.length}</span> commands
                  </div>
                  {(searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedDifficulty('all');
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 self-start sm:self-auto"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Commands Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredCommands.map((cmd, index) => {
                const CategoryIcon = getCategoryIcon(cmd.category);
                return (
                  <Card 
                    key={index} 
                    className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden"
                  >
                    <CardHeader className="pb-3 sm:pb-4 relative">
                      {/* Category and Difficulty Badges */}
                      <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                        <Badge className={`${getCategoryColor(cmd.category)} px-2 sm:px-3 py-1 text-xs font-semibold shadow-sm flex items-center gap-1 flex-shrink-0`}>
                          <CategoryIcon className="w-3 h-3" />
                          <span className="hidden sm:inline">{cmd.category}</span>
                        </Badge>
                        <Badge className={`${getDifficultyColor(cmd.difficulty)} px-2 sm:px-3 py-1 text-xs font-semibold shadow-sm flex-shrink-0`}>
                          {cmd.difficulty}
                        </Badge>
                      </div>
                      
                      {/* Command Title */}
                      <CardTitle className="font-mono text-base sm:text-lg bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 dark:group-hover:from-blue-300 dark:group-hover:to-purple-300 transition-all duration-300 break-all">
                        {cmd.command}
                      </CardTitle>
                      
                      {/* Description */}
                      <CardDescription className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                        {cmd.shortDescription}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                      {/* Use Case */}
                      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 p-3 sm:p-4 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                          <Star className="w-3 h-3" />
                          When to use:
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {cmd.useCase}
                        </p>
                      </div>

                      {/* Example Command */}
                      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-3 rounded-xl shadow-inner">
                        <div className="flex items-center gap-2 mb-2">
                          <Terminal className="w-3 h-3 text-green-400" />
                          <span className="text-xs font-semibold text-green-400">Example:</span>
                        </div>
                        <code className="text-green-400 font-mono text-xs block break-all">
                          $ {cmd.example}
                        </code>
                      </div>

                      {/* Common Flags */}
                      {cmd.commonFlags.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Settings className="w-3 h-3" />
                            Common options:
                          </h4>
                          <div className="space-y-2">
                            {cmd.commonFlags.slice(0, 2).map((flag, flagIndex) => (
                              <div key={flagIndex} className="flex items-start gap-2 text-xs">
                                <code className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded font-mono text-xs font-semibold flex-shrink-0">
                                  {flag.flag}
                                </code>
                                <span className="text-slate-600 dark:text-slate-400 leading-relaxed min-w-0 break-words">
                                  {flag.description}
                                </span>
                              </div>
                            ))}
                            {cmd.commonFlags.length > 2 && (
                              <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                                +{cmd.commonFlags.length - 2} more options available
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* No Results State */}
            {filteredCommands.length === 0 && (
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 shadow-xl">
                <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 text-center px-4 sm:px-6">
                  <div className="text-yellow-800 dark:text-yellow-400">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mb-2">No commands found</h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4 max-w-md mx-auto">
                      We couldn&apos;t find any Git commands matching your current search and filter criteria.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedDifficulty('all');
                      }}
                      className="bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                    >
                      Clear all filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
