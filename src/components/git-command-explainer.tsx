'use client';

import { useState, useEffect } from 'react';
import { Search, Lightbulb, BookOpen, Zap, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitExplainer, GitCommandExplanation } from '@/lib/git-explainer';

export function GitCommandExplainer() {
  const [query, setQuery] = useState('');
  const [explanation, setExplanation] = useState<GitCommandExplanation | null>(null);
  const [suggestions, setSuggestions] = useState<GitCommandExplanation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [randomTip, setRandomTip] = useState<GitCommandExplanation | null>(null);

  // Get random tip on component mount
  useEffect(() => {
    setRandomTip(GitExplainer.getRandomTip());
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    if (!query.trim()) {
      setExplanation(null);
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      // Try to get exact explanation first
      const exactMatch = GitExplainer.explain(query);
      if (exactMatch) {
        setExplanation(exactMatch);
        setSuggestions([]);
      } else {
        // Show search results
        const searchResults = GitExplainer.searchCommands(query).slice(0, 5);
        setExplanation(null);
        setSuggestions(searchResults);
      }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleCommandSelect = (command: GitCommandExplanation) => {
    setQuery(command.command);
    setExplanation(command);
    setSuggestions([]);
  };

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
      {/* Search Interface */}
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Git Command Explainer
          </CardTitle>
          <CardDescription>
            Get instant, AI-like explanations for any Git command. Just type and learn!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Type a Git command (e.g., git cherry-pick, git rebase, merge...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 text-base"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Command Explanation */}
      {explanation && (
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-mono text-xl text-blue-600 dark:text-blue-400">
                {explanation.command}
              </CardTitle>
              <div className="flex gap-2">
                <Badge className={getCategoryColor(explanation.category)}>
                  {explanation.category}
                </Badge>
                <Badge className={getDifficultyColor(explanation.difficulty)}>
                  {explanation.difficulty}
                </Badge>
              </div>
            </div>
            <CardDescription className="text-lg font-medium text-slate-700 dark:text-slate-300">
              {explanation.shortDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Detailed Explanation */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                How it works
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {explanation.detailedExplanation}
              </p>
            </div>

            {/* Use Case */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                When to use it
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {explanation.useCase}
              </p>
            </div>

            {/* Example */}
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Example Usage</h3>
              <code className="bg-black text-green-400 p-3 rounded block font-mono text-sm">
                $ {explanation.example}
              </code>
            </div>

            {/* Common Flags */}
            {explanation.commonFlags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Common Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {explanation.commonFlags.map((flag, index) => (
                    <div key={index} className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                      <code className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {flag.flag}
                      </code>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {flag.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Commands */}
            {explanation.relatedCommands.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Related Commands</h3>
                <div className="flex flex-wrap gap-2">
                  {explanation.relatedCommands.map((cmd, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setQuery(cmd)}
                      className="font-mono text-xs"
                    >
                      {cmd}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search Suggestions */}
      {suggestions.length > 0 && (
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Did you mean...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestions.map((cmd, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => handleCommandSelect(cmd)}
                >
                  <div className="text-left">
                    <div className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {cmd.command}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {cmd.shortDescription}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Random Tip */}
      {!query && randomTip && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Git Tip of the Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="font-mono font-semibold text-purple-600 dark:text-purple-400">
                {randomTip.command}
              </div>
              <p className="text-slate-700 dark:text-slate-300">
                {randomTip.shortDescription}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCommandSelect(randomTip)}
              >
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {query && !explanation && suggestions.length === 0 && !isSearching && (
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
              <AlertCircle className="h-5 w-5" />
              <span className="font-semibold">Command not found</span>
            </div>
            <p className="text-yellow-700 dark:text-yellow-300 mt-2">
              I don't recognize "{query}". Try typing a Git command like "git commit", "cherry-pick", or "rebase".
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
