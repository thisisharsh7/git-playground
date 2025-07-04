export function SvgBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated SVG Background */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#764ba2" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f093fb" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#f5576c" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4facfe" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="darkGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#764ba2" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="darkGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f093fb" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#f5576c" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="darkGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4facfe" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* Light Mode Elements */}
        <g className="dark:opacity-0 opacity-100 transition-opacity duration-500">
          {/* Floating Geometric Shapes */}
          <g className="animate-pulse">
            <circle cx="100" cy="100" r="50" fill="url(#grad1)" className="animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
            <circle cx="1100" cy="150" r="30" fill="url(#grad2)" className="animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
            <circle cx="200" cy="600" r="40" fill="url(#grad3)" className="animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }} />
          </g>

          {/* Git Branch-like Paths */}
          <g stroke="url(#grad1)" strokeWidth="2" fill="none" opacity="0.4">
            <path d="M50 400 Q300 200 600 400 T1150 400" className="animate-pulse" />
            <path d="M100 500 Q400 300 700 500 T1100 500" className="animate-pulse" style={{ animationDelay: '1s' }} />
            <path d="M0 300 Q250 100 500 300 T1000 300" className="animate-pulse" style={{ animationDelay: '2s' }} />
          </g>

          {/* Code-like Dots Pattern */}
          <g fill="url(#grad2)" opacity="0.3">
            {Array.from({ length: 20 }).map((_, i) => (
              <circle
                key={i}
                cx={50 + (i * 60)}
                cy={50 + Math.sin(i) * 30}
                r="3"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </g>

          {/* Terminal-like Grid */}
          <g stroke="url(#grad3)" strokeWidth="1" opacity="0.15">
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="800" />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 100} x2="1200" y2={i * 100} />
            ))}
          </g>

          {/* Floating Git Icons */}
          <g className="animate-pulse">
            <text x="900" y="200" fontSize="24" fill="url(#grad1)" opacity="0.4" className="font-mono">git</text>
            <text x="300" y="700" fontSize="20" fill="url(#grad2)" opacity="0.4" className="font-mono">commit</text>
            <text x="800" y="600" fontSize="18" fill="url(#grad3)" opacity="0.4" className="font-mono">branch</text>
            <text x="150" y="300" fontSize="16" fill="url(#grad1)" opacity="0.4" className="font-mono">merge</text>
          </g>
        </g>

        {/* Dark Mode Elements */}
        <g className="dark:opacity-100 opacity-0 transition-opacity duration-500">
          {/* Floating Geometric Shapes */}
          <g className="animate-pulse">
            <circle cx="100" cy="100" r="50" fill="url(#darkGrad1)" className="animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
            <circle cx="1100" cy="150" r="30" fill="url(#darkGrad2)" className="animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
            <circle cx="200" cy="600" r="40" fill="url(#darkGrad3)" className="animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }} />
          </g>

          {/* Git Branch-like Paths */}
          <g stroke="url(#darkGrad1)" strokeWidth="2" fill="none" opacity="0.2">
            <path d="M50 400 Q300 200 600 400 T1150 400" className="animate-pulse" />
            <path d="M100 500 Q400 300 700 500 T1100 500" className="animate-pulse" style={{ animationDelay: '1s' }} />
            <path d="M0 300 Q250 100 500 300 T1000 300" className="animate-pulse" style={{ animationDelay: '2s' }} />
          </g>

          {/* Code-like Dots Pattern */}
          <g fill="url(#darkGrad2)" opacity="0.15">
            {Array.from({ length: 20 }).map((_, i) => (
              <circle
                key={i}
                cx={50 + (i * 60)}
                cy={50 + Math.sin(i) * 30}
                r="3"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </g>

          {/* Terminal-like Grid */}
          <g stroke="url(#darkGrad3)" strokeWidth="1" opacity="0.08">
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="800" />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 100} x2="1200" y2={i * 100} />
            ))}
          </g>

          {/* Floating Git Icons */}
          <g className="animate-pulse">
            <text x="900" y="200" fontSize="24" fill="url(#darkGrad1)" opacity="0.2" className="font-mono">git</text>
            <text x="300" y="700" fontSize="20" fill="url(#darkGrad2)" opacity="0.2" className="font-mono">commit</text>
            <text x="800" y="600" fontSize="18" fill="url(#darkGrad3)" opacity="0.2" className="font-mono">branch</text>
            <text x="150" y="300" fontSize="16" fill="url(#darkGrad1)" opacity="0.2" className="font-mono">merge</text>
          </g>
        </g>
      </svg>

      {/* Additional Overlay for Better Contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-slate-100/20 dark:from-slate-900/30 dark:to-slate-950/20 transition-colors duration-500"></div>
    </div>
  );
}
