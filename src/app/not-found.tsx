'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Search, 
  BookOpen, 
  Terminal, 
  BarChart3, 
  ArrowRight,
  GitBranch,
  Clock
} from 'lucide-react';

export default function NotFound() {
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // Suggest redirections based on the current path
  const getSuggestions = (path: string) => {
    const suggestions = [];
    
    // Git command suggestions
    if (path.includes('git') || path.includes('command')) {
      suggestions.push({
        title: 'Git Commands Reference',
        description: 'Explore our comprehensive Git commands guide',
        href: '/git-playground?tab=commands',
        icon: Terminal,
        badge: 'Commands'
      });
    }
    
    // Learning suggestions
    if (path.includes('learn') || path.includes('tutorial') || path.includes('lesson')) {
      suggestions.push({
        title: 'Interactive Lessons',
        description: 'Start with our structured Git learning path',
        href: '/git-playground?tab=lessons',
        icon: BookOpen,
        badge: 'Learn'
      });
    }
    
    // Visualization suggestions
    if (path.includes('visual') || path.includes('tree') || path.includes('flow')) {
      suggestions.push({
        title: 'Git Visualizations',
        description: 'Understand Git with interactive diagrams',
        href: '/git-playground?tab=visualization',
        icon: BarChart3,
        badge: 'Visual'
      });
    }
    
    // Always include playground as a suggestion
    suggestions.push({
      title: 'Git Playground',
      description: 'Practice Git commands in a safe environment',
      href: '/git-playground',
      icon: GitBranch,
      badge: 'Practice'
    });
    
    return suggestions;
  };

  const suggestions = getSuggestions(currentPath);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        
        {/* Main 404 Card */}
        <Card className="text-center mb-8 border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Search className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-red-800 to-pink-800 dark:from-white dark:via-red-200 dark:to-pink-200 bg-clip-text text-transparent mb-2">
              Page Not Found
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
              The page you&apos;re looking for doesn&apos;t exist, but we can help you find what you need!
            </CardDescription>
            {currentPath && (
              <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Requested path: <code className="font-mono bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded text-xs">{currentPath}</code>
                </p>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/git-playground" className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  Git Playground
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center text-slate-900 dark:text-slate-100 mb-6">
            Maybe you&apos;re looking for:
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((suggestion, index) => {
              const IconComponent = suggestion.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {suggestion.title}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {suggestion.badge}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          {suggestion.description}
                        </p>
                        <Button asChild variant="ghost" size="sm" className="p-0 h-auto font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                          <Link href={suggestion.href} className="flex items-center gap-1">
                            Explore
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <Card className="mt-8 border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 text-center text-slate-900 dark:text-slate-100">
              Quick Navigation
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/git-playground?tab=playground">
                  <Terminal className="w-3 h-3 mr-1" />
                  Playground
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/git-playground?tab=lessons">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Lessons
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/git-playground?tab=commands">
                  <Terminal className="w-3 h-3 mr-1" />
                  Commands
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/git-playground?tab=visualization">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Visualizations
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
          <p className="flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            Lost? Our Git playground is always here to help you learn!
          </p>
        </div>
      </div>
    </div>
  );
}
