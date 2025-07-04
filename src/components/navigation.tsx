'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SimpleAnimatedThemeToggle } from './simple-animated-theme-toggle';
import { useState } from 'react';

function GitLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Animated Git Logo */}
      <div className="relative">
        <svg
          width="36"
          height="36"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-110"
        >
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
          
          {/* Git Branch Visualization */}
          <circle cx="8" cy="16" r="3" fill="url(#logoGrad)" className="animate-pulse" />
          <circle cx="16" cy="8" r="3" fill="url(#logoGrad)" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
          <circle cx="24" cy="16" r="3" fill="url(#logoGrad)" className="animate-pulse" style={{ animationDelay: '1s' }} />
          <circle cx="16" cy="24" r="3" fill="url(#logoGrad)" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
          
          {/* Connecting Lines */}
          <line x1="8" y1="16" x2="16" y2="8" stroke="url(#logoGrad)" strokeWidth="2" opacity="0.7" />
          <line x1="16" y1="8" x2="24" y2="16" stroke="url(#logoGrad)" strokeWidth="2" opacity="0.7" />
          <line x1="8" y1="16" x2="16" y2="24" stroke="url(#logoGrad)" strokeWidth="2" opacity="0.7" />
          <line x1="16" y1="24" x2="24" y2="16" stroke="url(#logoGrad)" strokeWidth="2" opacity="0.7" />
        </svg>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-20 animate-pulse"></div>
      </div>
      
      {/* Brand Text */}
      <div className="flex flex-col">
        <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Git Master
        </span>
        <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400 -mt-1">
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
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/git-playground', label: 'Playground', icon: '🎮' },
  ];

  // Check if we're on the git-playground route to remove sticky behavior
  const isPlaygroundRoute = pathname === '/git-playground';

  return (
    <nav className={`${isPlaygroundRoute ? '' : 'sticky top-0'} z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-slate-200/50 dark:border-slate-700/50`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="transition-transform duration-200 hover:scale-105">
            <GitLogo />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? 'default' : 'ghost'}
                  size="sm"
                  className={`transition-all duration-200 text-sm md:text-base px-4 py-2 ${
                    pathname === item.href 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="mr-2 text-base">{item.icon}</span>
                  {item.label}
                </Button>
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <div className="ml-4">
              <SimpleAnimatedThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <SimpleAnimatedThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="transition-transform duration-200 hover:scale-105 p-2"
            >
              <div className="flex flex-col space-y-1">
                <div className={`w-5 h-0.5 bg-current transition-transform duration-200 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-current transition-opacity duration-200 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-current transition-transform duration-200 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col space-y-2 pb-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={pathname === item.href ? 'default' : 'ghost'}
                  size="sm"
                  className={`w-full justify-start transition-all duration-200 text-sm ${
                    pathname === item.href 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="mr-3 text-base">{item.icon}</span>
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
