'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef, useCallback } from 'react';

export function SimpleAnimatedThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the actual current theme (no system preference, only light/dark)
  useEffect(() => {
    if (!mounted) return;

    // If theme is system or undefined, default to light
    if (!theme) {
      setTheme('light');
      setCurrentTheme('light');
    } else {
      setCurrentTheme(theme as 'light' | 'dark');
    }
  }, [theme, mounted, setTheme]);

  // Disable all CSS transitions during theme change
  const disableTransitions = useCallback(() => {
    const style = document.createElement('style');
    style.id = 'disable-transitions';
    style.innerHTML = `
      *, *::before, *::after {
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        animation-duration: 0s !important;
        animation-delay: 0s !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const enableTransitions = useCallback(() => {
    const style = document.getElementById('disable-transitions');
    if (style) {
      style.remove();
    }
  }, []);

  const animateThemeChange = useCallback(async () => {
    if (isAnimating || !overlayRef.current) return;

    setIsAnimating(true);
    const overlay = overlayRef.current;

    // Determine the new theme (toggle between light and dark only)
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    // Calculate the maximum distance from top-right corner to cover entire viewport
    const maxDistance = Math.sqrt(
      Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)
    ) + 100;

    // STEP 1: Immediately disable all transitions and apply theme change
    disableTransitions();
    setTheme(newTheme);

    // STEP 2: Set up the overlay to match the NEW theme (what we just switched to)
    overlay.style.display = 'block';
    overlay.style.background = newTheme === 'dark'
      ? 'linear-gradient(135deg, rgb(15 23 42) 0%, rgb(2 6 23) 100%)'
      : 'linear-gradient(135deg, rgb(248 250 252) 0%, rgb(241 245 249) 100%)';

    // STEP 3: Start with overlay covering the entire screen (reverse approach)
    overlay.style.clipPath = `circle(${maxDistance}px at ${window.innerWidth}px 0px)`;
    overlay.style.transition = 'none';

    // Force reflow
    void overlay.offsetHeight;

    // STEP 4: Animate the overlay shrinking away to reveal the new theme
    overlay.style.transition = 'clip-path 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
    overlay.style.clipPath = `circle(0px at ${window.innerWidth}px 0px)`;

    // STEP 5: Wait for shrink animation to complete
    await new Promise(resolve => setTimeout(resolve, 800));

    // STEP 6: Clean up
    overlay.style.display = 'none';
    overlay.style.transition = 'none';

    // STEP 7: Re-enable transitions
    setTimeout(() => {
      enableTransitions();
    }, 50);

    setIsAnimating(false);
  }, [isAnimating, setTheme, currentTheme, disableTransitions, enableTransitions]);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-9 h-9 px-0"
        disabled
      >
        <div className="h-4 w-4 animate-pulse bg-slate-300 dark:bg-slate-600 rounded"></div>
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    );
  }

  return (
    <>
      {/* Unified Circular Mask Animation Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{
          display: 'none',
          willChange: 'clip-path',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)' // Force hardware acceleration
        }}
        aria-hidden="true"
      />

      <Button
        variant="ghost"
        size="sm"
        className="w-9 h-9 px-0 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 relative group"
        onClick={animateThemeChange}
        disabled={isAnimating}
        aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 group-hover:rotate-12" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 dark:group-hover:-rotate-12" />
        <span className="sr-only">Toggle theme</span>

        {/* Subtle animation indicator */}
        {isAnimating && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 dark:bg-yellow-400 rounded-full animate-pulse" />
        )}
      </Button>
    </>
  );
}
