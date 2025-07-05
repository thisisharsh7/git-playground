'use client';

import { useCallback, useRef, useState } from 'react';
import { useTheme } from '@/components/theme-provider';

interface AnimationOptions {
  duration?: number;
  easing?: string;
  origin?: { x: number; y: number } | 'center' | 'auto';
}

export function useThemeAnimation() {
  const { setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const animateThemeChange = useCallback(async (
    newTheme: 'light' | 'dark' | 'system',
    triggerElement?: HTMLElement | null,
    options: AnimationOptions = {}
  ) => {
    if (isAnimating || !overlayRef.current) return;

    const {
      duration = 600,
      easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
      origin = 'auto'
    } = options;

    setIsAnimating(true);
    const overlay = overlayRef.current;

    // Determine animation origin
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (origin === 'auto' && triggerElement) {
      const rect = triggerElement.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else if (typeof origin === 'object') {
      x = origin.x;
      y = origin.y;
    }

    // Calculate the maximum distance to cover the entire viewport
    const maxDistance = Math.sqrt(
      Math.pow(Math.max(x, window.innerWidth - x), 2) +
      Math.pow(Math.max(y, window.innerHeight - y), 2)
    );

    // Determine if we're going to dark mode
    const isDarkMode = newTheme === 'dark' || 
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Set up the overlay
    overlay.style.display = 'block';
    overlay.style.background = isDarkMode 
      ? 'oklch(0.145 0 0)' // Dark background
      : 'oklch(1 0 0)';    // Light background
    
    overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
    
    // Force a reflow
    void overlay.offsetHeight;
    
    // Start the animation
    overlay.style.transition = `clip-path ${duration}ms ${easing}`;
    overlay.style.clipPath = `circle(${maxDistance}px at ${x}px ${y}px)`;
    
    // Wait for animation to complete halfway
    await new Promise(resolve => setTimeout(resolve, duration / 2));
    
    // Apply the theme change
    if (newTheme === 'system') {
      // For system theme, determine the actual theme based on system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    } else {
      setTheme(newTheme);
    }
    
    // Wait for the rest of the animation
    await new Promise(resolve => setTimeout(resolve, duration / 2));
    
    // Hide the overlay
    overlay.style.display = 'none';
    overlay.style.transition = '';
    
    setIsAnimating(false);
  }, [isAnimating, setTheme]);

  return {
    animateThemeChange,
    isAnimating,
    overlayRef,
  };
}
