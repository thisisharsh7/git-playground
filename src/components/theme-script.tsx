export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            var theme = localStorage.getItem('git-master-theme') || 'system';
            var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            
            if (theme === 'system') {
              document.documentElement.classList.add(systemTheme);
            } else {
              document.documentElement.classList.add(theme);
            }
          } catch (e) {
            console.log('Theme script error:', e);
          }
        `,
      }}
    />
  );
}
