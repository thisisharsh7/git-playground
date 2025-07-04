import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-16 md:space-y-20">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 md:space-y-8 pt-8 md:pt-12">
          <div className="space-y-4 md:space-y-6">
            <div className="inline-block">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 bg-clip-text text-transparent animate-pulse">
                Git Master
              </h1>
              <div className="h-1 md:h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-3 md:mt-4 animate-pulse"></div>
            </div>
            <p className="text-lg md:text-xl lg:text-2xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto px-4 leading-relaxed font-medium">
              Master Git version control with our interactive playground. Learn Git commands, visualize workflows, and understand version control concepts through hands-on practice.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center px-4 pt-6">
            <Link href="/git-playground">
              <Button 
                size="lg" 
                className="text-base md:text-lg lg:text-xl px-8 md:px-12 py-4 md:py-6 w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                <span className="mr-3 text-xl">🚀</span>
                Start Learning Git
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4">
          <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                <span className="text-3xl md:text-4xl">💻</span>
              </div>
              <CardTitle className="text-lg md:text-xl lg:text-2xl bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent font-bold">
                Interactive Terminal
              </CardTitle>
              <CardDescription className="text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Execute real Git commands in a safe, simulated environment
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                <span className="text-3xl md:text-4xl">📊</span>
              </div>
              <CardTitle className="text-lg md:text-xl lg:text-2xl bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent font-bold">
                Visual Learning
              </CardTitle>
              <CardDescription className="text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                See Git concepts in action with interactive diagrams and visualizations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                <span className="text-3xl md:text-4xl">📚</span>
              </div>
              <CardTitle className="text-lg md:text-xl lg:text-2xl bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent font-bold">
                Structured Lessons
              </CardTitle>
              <CardDescription className="text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Follow a progressive learning path from Git basics to advanced workflows
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                <span className="text-3xl md:text-4xl">📖</span>
              </div>
              <CardTitle className="text-lg md:text-xl lg:text-2xl bg-gradient-to-r from-orange-600 to-orange-800 dark:from-orange-400 dark:to-orange-600 bg-clip-text text-transparent font-bold">
                Command Reference
              </CardTitle>
              <CardDescription className="text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Complete Git command documentation with examples and use cases
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Learning Path */}
        <div className="space-y-10 md:space-y-12 px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent mb-3 md:mb-5 py-1">
              Your Git Learning Journey
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl lg:text-2xl font-medium">
              Master Git step by step with our comprehensive learning platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
            
            {/* Beginner Path */}
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl md:text-2xl lg:text-3xl flex items-center gap-3 font-bold">
                    <span className="text-3xl md:text-4xl">🌱</span>
                    Git Fundamentals
                  </CardTitle>
                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 text-sm md:text-base px-3 py-1">
                    Beginner
                  </Badge>
                </div>
                <CardDescription className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  Start your Git journey with essential concepts and commands
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm md:text-base">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span>What is version control?</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm md:text-base">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <span>Repository basics</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm md:text-base">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span>Working directory & staging area</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm md:text-base">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                    <span>Basic commands: init, add, commit</span>
                  </div>
                </div>
                <Link href="/git-playground">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 text-base md:text-lg py-3 font-semibold">
                    Start with Basics
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Advanced Path */}
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl md:text-2xl lg:text-3xl flex items-center gap-3 font-bold">
                    <span className="text-3xl md:text-4xl">🚀</span>
                    Advanced Git
                  </CardTitle>
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 text-sm md:text-base px-3 py-1">
                    Advanced
                  </Badge>
                </div>
                <CardDescription className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  Master complex Git workflows and collaboration techniques
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm md:text-base">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Branching strategies</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm md:text-base">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <span>Merge vs Rebase</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm md:text-base">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span>Remote repositories</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm md:text-base">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                    <span>Conflict resolution</span>
                  </div>
                </div>
                <Link href="/git-playground">
                  <Button variant="outline" className="w-full border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 text-base md:text-lg py-3 font-semibold">
                    Explore Advanced
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 mx-4">
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-500 dark:via-purple-500 dark:to-blue-700 border-0 shadow-2xl">
            <CardContent className="p-8 md:p-12 lg:p-16 text-white">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Ready to Master Git?</h2>
              <p className="text-lg md:text-xl lg:text-2xl opacity-90 max-w-3xl mx-auto mb-8 leading-relaxed font-medium">
                Start with Git fundamentals or jump into advanced challenges. Both paths will make you a better developer.
              </p>
              <Link href="/git-playground">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 bg-white text-blue-600 hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold"
                >
                  <span className="mr-3 text-xl">🎯</span>
                  Start Your Journey
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
