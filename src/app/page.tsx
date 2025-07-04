import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Git Master
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Master Git version control with our interactive playground. Learn Git commands, visualize workflows, and understand version control concepts through hands-on practice.
            </p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Link href="/git-playground">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Learning Git
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💻</span>
              </div>
              <CardTitle>Interactive Terminal</CardTitle>
              <CardDescription>
                Execute real Git commands in a safe, simulated environment
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <CardTitle>Visual Learning</CardTitle>
              <CardDescription>
                See Git concepts in action with interactive diagrams and visualizations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📚</span>
              </div>
              <CardTitle>Structured Lessons</CardTitle>
              <CardDescription>
                Follow a progressive learning path from Git basics to advanced workflows
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📖</span>
              </div>
              <CardTitle>Command Reference</CardTitle>
              <CardDescription>
                Complete Git command documentation with examples and use cases
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Learning Path */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Your Git Learning Journey
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Master Git step by step with our comprehensive learning platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Beginner Path */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Git Fundamentals</CardTitle>
                  <Badge className="bg-green-100 text-green-800">Beginner</Badge>
                </div>
                <CardDescription>
                  Start your Git journey with essential concepts and commands
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>What is version control?</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Repository basics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Working directory & staging area</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Basic commands: init, add, commit</span>
                  </div>
                </div>
                <Link href="/git-playground">
                  <Button className="w-full">Start with Basics</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Advanced Path */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Advanced Git</CardTitle>
                  <Badge className="bg-blue-100 text-blue-800">Advanced</Badge>
                </div>
                <CardDescription>
                  Master complex Git workflows and collaboration techniques
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Branching strategies</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Merge vs Rebase</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Remote repositories</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Conflict resolution</span>
                  </div>
                </div>
                <Link href="/git-playground">
                  <Button variant="outline" className="w-full">Explore Advanced</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Platform Features */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Why Choose Git Master?
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              The most comprehensive and beginner-friendly way to learn Git
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold">Beginner Focused</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Designed specifically for developers new to version control
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-semibold">Safe Environment</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Practice Git commands without fear of breaking anything
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold">Instant Feedback</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                See the results of your commands immediately with visual feedback
              </p>
            </div>
          </div>
        </div>

        {/* Git Commands Preview */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Master Essential Git Commands
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Learn the most important Git commands with interactive examples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { cmd: 'git init', desc: 'Initialize repository' },
              { cmd: 'git add', desc: 'Stage changes' },
              { cmd: 'git commit', desc: 'Save changes' },
              { cmd: 'git branch', desc: 'Manage branches' },
              { cmd: 'git merge', desc: 'Combine branches' },
              { cmd: 'git push', desc: 'Upload changes' },
              { cmd: 'git pull', desc: 'Download changes' },
              { cmd: 'git status', desc: 'Check repository state' }
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="font-mono text-sm bg-slate-100 dark:bg-slate-800 p-2 rounded mb-2">
                    {item.cmd}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold">Ready to Master Git?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of developers who have learned Git the interactive way. Start your journey from complete beginner to Git expert.
          </p>
          <Link href="/git-playground">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start Learning Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
