'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SimpleAnimatedThemeToggle } from './simple-animated-theme-toggle';
import { useState } from 'react';
import { Menu, X, Home, Play } from 'lucide-react';

function GitLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Enhanced Animated Git Logo */}
      <div className="relative group">
        <svg
          width="40"
          height="40"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
        >
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="50%" stopColor="#764ba2" />
              <stop offset="100%" stopColor="#f093fb" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Git Branch Visualization with enhanced animation */}
          <circle cx="8" cy="16" r="3.5" fill="url(#logoGrad)" className="animate-pulse" filter="url(#glow)" />
          <circle cx="16" cy="8" r="3.5" fill="url(#logoGrad)" className="animate-pulse" style={{ animationDelay: '0.5s' }} filter="url(#glow)" />
          <circle cx="24" cy="16" r="3.5" fill="url(#logoGrad)" className="animate-pulse" style={{ animationDelay: '1s' }} filter="url(#glow)" />
          <circle cx="16" cy="24" r="3.5" fill="url(#logoGrad)" className="animate-pulse" style={{ animationDelay: '1.5s' }} filter="url(#glow)" />
          
          {/* Enhanced Connecting Lines */}
          <line x1="8" y1="16" x2="16" y2="8" stroke="url(#logoGrad)" strokeWidth="3" opacity="0.8" className="animate-pulse" />
          <line x1="16" y1="8" x2="24" y2="16" stroke="url(#logoGrad)" strokeWidth="3" opacity="0.8" className="animate-pulse" />
          <line x1="8" y1="16" x2="16" y2="24" stroke="url(#logoGrad)" strokeWidth="3" opacity="0.8" className="animate-pulse" />
          <line x1="16" y1="24" x2="24" y2="16" stroke="url(#logoGrad)" strokeWidth="3" opacity="0.8" className="animate-pulse" />
        </svg>
        
        {/* Enhanced Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-lg opacity-30 animate-pulse group-hover:opacity-50 transition-opacity duration-500"></div>
      </div>
      
      {/* Enhanced Brand Text */}
      <div className="flex flex-col">
        <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          Git Master
        </span>
        <span className="text-sm md:text-base text-slate-500 dark:text-slate-400 -mt-1 font-medium">
          Interactive Learning
        </span>
      </div>
    </div>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/git-playground', label: 'Playground', icon: Play },
  ];

  // Check if we're on the git-playground route to remove sticky behavior
  const isPlaygroundRoute = pathname === '/git-playground';

  return (
    <nav className={`${isPlaygroundRoute ? '' : 'sticky top-0'} z-50 border-b bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg border-slate-200/50 dark:border-slate-700/50`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link href="/" className="transition-all duration-300 hover:scale-105 active:scale-95">
            <GitLogo />
          </Link>
          
          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? 'default' : 'ghost'}
                    size="lg"
                    className={`transition-all duration-300 text-base font-semibold px-6 py-3 ${
                      pathname === item.href 
                        ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 border-0' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:scale-105'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            
            {/* Enhanced Theme Toggle */}
            <div className="ml-6 pl-6 border-l border-slate-200 dark:border-slate-700">
              <SimpleAnimatedThemeToggle />
            </div>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <SimpleAnimatedThemeToggle />
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="transition-all duration-300 hover:scale-110 active:scale-95 p-3 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-slate-700 dark:text-slate-300" />
              ) : (
                <Menu className="h-6 w-6 text-slate-700 dark:text-slate-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <div className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-64 opacity-100 mt-6' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col space-y-3 pb-6 bg-gradient-to-br from-white/95 to-slate-50/95 dark:from-slate-900/95 dark:to-slate-800/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant={pathname === item.href ? 'default' : 'ghost'}
                    size="lg"
                    className={`w-full justify-start transition-all duration-300 text-base font-semibold py-4 ${
                      pathname === item.href 
                        ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mr-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
