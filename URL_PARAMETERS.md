# URL Parameters Guide

This document explains how to use URL parameters to link directly to specific sections and content in the Git Master platform.

## Base URL Structure

```
https://my-git-playground.vercel.app/git-playground?tab={tab}&search={query}
```

## Available Tab Parameters

### `?tab=playground`
Links directly to the interactive Git playground where users can execute commands.

**Example:**
```
https://my-git-playground.vercel.app/git-playground?tab=playground
```

### `?tab=lessons`
Links directly to the structured learning lessons section.

**Example:**
```
https://my-git-playground.vercel.app/git-playground?tab=lessons
```

### `?tab=commands`
Links directly to the Git commands reference section.

**Example:**
```
https://my-git-playground.vercel.app/git-playground?tab=commands
```

### `?tab=visualization`
Links directly to the Git workflow visualization section.

**Example:**
```
https://my-git-playground.vercel.app/git-playground?tab=visualization
```

## Search Parameters

### `?search={query}`
When combined with `tab=commands`, pre-fills the search field with a specific query.

**Example:**
```
https://my-git-playground.vercel.app/git-playground?tab=commands&search=commit
```

## Automatic Redirects

The platform includes middleware that automatically redirects common URLs to the appropriate sections:

### Learning Paths
- `/learn` → `/git-playground?tab=lessons`
- `/tutorial` → `/git-playground?tab=lessons`
- `/lessons` → `/git-playground?tab=lessons`
- `/getting-started` → `/git-playground?tab=lessons`

### Practice Areas
- `/practice` → `/git-playground?tab=playground`
- `/playground` → `/git-playground?tab=playground`
- `/start` → `/git-playground?tab=playground`

### Reference Materials
- `/commands` → `/git-playground?tab=commands`
- `/docs` → `/git-playground?tab=commands`
- `/documentation` → `/git-playground?tab=commands`
- `/help` → `/git-playground?tab=commands`

### Visualizations
- `/visualization` → `/git-playground?tab=visualization`
- `/visualize` → `/git-playground?tab=visualization`

### Git Command Shortcuts
Any URL matching the pattern `/git-{command}` will redirect to the commands tab with that command pre-searched:

- `/git-add` → `/git-playground?tab=commands&search=add`
- `/git-commit` → `/git-playground?tab=commands&search=commit`
- `/git-push` → `/git-playground?tab=commands&search=push`
- `/git-pull` → `/git-playground?tab=commands&search=pull`
- `/git-branch` → `/git-playground?tab=commands&search=branch`
- `/git-merge` → `/git-playground?tab=commands&search=merge`

### Search Queries
- `/search?q={query}` → `/git-playground?tab=commands&search={query}`

## Usage Examples

### Direct Links for Social Sharing
```html
<!-- Link to start learning -->
<a href="https://my-git-playground.vercel.app/git-playground?tab=playground">
  Start Git Playground
</a>

<!-- Link to specific command -->
<a href="https://my-git-playground.vercel.app/git-playground?tab=commands&search=rebase">
  Learn Git Rebase
</a>

<!-- Link to lessons -->
<a href="https://my-git-playground.vercel.app/git-playground?tab=lessons">
  Git Learning Lessons
</a>
```

### Marketing Campaign URLs
```
# Beginner-focused campaign
https://my-git-playground.vercel.app/git-playground?tab=lessons

# Developer tool promotion
https://my-git-playground.vercel.app/git-playground?tab=commands

# Visual learner campaign
https://my-git-playground.vercel.app/git-playground?tab=visualization
```

### Educational Content Integration
```
# Blog post about Git add command
https://my-git-playground.vercel.app/git-playground?tab=commands&search=add

# Tutorial about Git workflows
https://my-git-playground.vercel.app/git-playground?tab=visualization

# Course curriculum integration
https://my-git-playground.vercel.app/git-playground?tab=lessons
```

## SEO Benefits

Using these URL parameters provides several SEO advantages:

1. **Deep Linking**: Users can bookmark and share specific sections
2. **Better Analytics**: Track which sections are most popular
3. **Improved UX**: Users land exactly where they expect
4. **Social Sharing**: Each section can have its own social media preview
5. **Campaign Tracking**: Different URLs for different marketing campaigns

## Implementation Notes

- All URL parameters are handled client-side with React hooks
- Invalid tab parameters default to 'playground'
- Search parameters are preserved when switching tabs
- URLs are updated without page refresh for better UX
- All URLs are SEO-friendly and shareable
