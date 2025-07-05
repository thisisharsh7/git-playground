'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { InteractiveLesson } from "./interactive-lesson";
import { QuizComponent } from "./quiz";
import { getQuizByLessonId } from "@/data/quizzes";
import { CheckCircle, Lock, Play, Trophy, BookOpen, ArrowRight } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  duration: string;
  topics: string[];
  commands: string[];
  completed: boolean;
}

interface LessonProgress {
  lessonId: string;
  lessonCompleted: boolean;
  quizCompleted: boolean;
  quizScore?: number;
  quizPassed: boolean;
}

const lessons: Lesson[] = [
  {
    id: 'git-basics',
    title: 'Git Basics',
    difficulty: 'Beginner',
    description: 'Learn the fundamental concepts of Git version control',
    duration: '15 min',
    topics: ['What is Git?', 'Repository', 'Working Directory', 'Staging Area'],
    commands: ['git init', 'git status', 'git add', 'git commit'],
    completed: false
  },
  {
    id: 'branching',
    title: 'Branching & Merging',
    difficulty: 'Beginner',
    description: 'Master Git branches and learn how to merge changes',
    duration: '20 min',
    topics: ['Creating branches', 'Switching branches', 'Merging', 'Conflicts'],
    commands: ['git branch', 'git checkout', 'git merge', 'git branch -d'],
    completed: false
  },
  {
    id: 'remote-repos',
    title: 'Remote Repositories',
    difficulty: 'Intermediate',
    description: 'Work with remote repositories and collaborate with others',
    duration: '25 min',
    topics: ['Remote repositories', 'Cloning', 'Pushing', 'Pulling'],
    commands: ['git clone', 'git remote', 'git push', 'git pull'],
    completed: false
  },
  {
    id: 'advanced-git',
    title: 'Advanced Git',
    difficulty: 'Advanced',
    description: 'Advanced Git techniques for power users',
    duration: '30 min',
    topics: ['Rebasing', 'Cherry-picking', 'Stashing', 'Reset vs Revert'],
    commands: ['git rebase', 'git cherry-pick', 'git stash', 'git reset'],
    completed: false
  }
];

export function GitLessons() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isInInteractiveMode, setIsInInteractiveMode] = useState(false);
  const [isInQuizMode, setIsInQuizMode] = useState(false);
  const [progress, setProgress] = useState<LessonProgress[]>([]);

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('git-lessons-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    } else {
      // Initialize progress for all lessons
      const initialProgress = lessons.map(lesson => ({
        lessonId: lesson.id,
        lessonCompleted: false,
        quizCompleted: false,
        quizPassed: false
      }));
      setProgress(initialProgress);
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (progress.length > 0) {
      localStorage.setItem('git-lessons-progress', JSON.stringify(progress));
    }
  }, [progress]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getLessonProgress = (lessonId: string): LessonProgress | undefined => {
    return progress.find(p => p.lessonId === lessonId);
  };

  const isLessonUnlocked = (lessonIndex: number): boolean => {
    if (lessonIndex === 0) return true; // First lesson is always unlocked
    
    const previousLesson = lessons[lessonIndex - 1];
    const previousProgress = getLessonProgress(previousLesson.id);
    
    return previousProgress?.quizPassed === true;
  };

  const updateLessonProgress = (lessonId: string, updates: Partial<LessonProgress>) => {
    setProgress(prev => {
      const existingIndex = prev.findIndex(p => p.lessonId === lessonId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...updates };
        return updated;
      } else {
        return [...prev, { lessonId, lessonCompleted: false, quizCompleted: false, quizPassed: false, ...updates }];
      }
    });
  };

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsInInteractiveMode(true);
  };

  const handleCompleteLesson = () => {
    if (selectedLesson) {
      updateLessonProgress(selectedLesson.id, { lessonCompleted: true });
      setIsInInteractiveMode(false);
      setIsInQuizMode(true); // Automatically start quiz after lesson
    }
  };

  const handleStartQuiz = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsInQuizMode(true);
  };

  const handleQuizComplete = (passed: boolean, score: number) => {
    if (selectedLesson) {
      updateLessonProgress(selectedLesson.id, {
        quizCompleted: true,
        quizPassed: passed,
        quizScore: score
      });
    }
  };

  const handleBackToLessons = () => {
    setIsInInteractiveMode(false);
    setIsInQuizMode(false);
    setSelectedLesson(null);
  };

  const handleBackFromLesson = () => {
    setSelectedLesson(null);
  };

  const getOverallProgress = () => {
    const completedLessons = progress.filter(p => p.quizPassed).length;
    return Math.round((completedLessons / lessons.length) * 100);
  };

  // Show quiz if in quiz mode
  if (isInQuizMode && selectedLesson) {
    const quiz = getQuizByLessonId(selectedLesson.id);
    if (quiz) {
      return (
        <QuizComponent
          quiz={quiz}
          onComplete={handleQuizComplete}
          onBack={handleBackToLessons}
        />
      );
    }
  }

  // Show interactive lesson if in interactive mode
  if (isInInteractiveMode && selectedLesson) {
    return (
      <InteractiveLesson
        lessonId={selectedLesson.id}
        onComplete={handleCompleteLesson}
        onBack={handleBackFromLesson}
      />
    );
  }

  // Show lesson detail view
  if (selectedLesson && !isInInteractiveMode && !isInQuizMode) {
    const lessonProgress = getLessonProgress(selectedLesson.id);
    const quiz = getQuizByLessonId(selectedLesson.id);
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl md:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {selectedLesson.title}
                </CardTitle>
                <CardDescription className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                  {selectedLesson.description}
                </CardDescription>
              </div>
              <Badge className={getDifficultyColor(selectedLesson.difficulty)}>
                {selectedLesson.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-lg">What you&apos;ll learn:</h3>
                <ul className="space-y-2">
                  {selectedLesson.topics.map((topic, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-lg">Git commands covered:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLesson.commands.map((command, index) => (
                    <Badge key={index} variant="outline" className="font-mono">
                      {command}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-blue-800 dark:text-blue-400">Learning Path</span>
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={lessonProgress?.lessonCompleted ? "text-green-600" : "text-slate-500"}>
                    {lessonProgress?.lessonCompleted ? "✓" : "1."}
                  </span>
                  <span>Complete the interactive lesson ({selectedLesson.duration})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={lessonProgress?.quizPassed ? "text-green-600" : "text-slate-500"}>
                    {lessonProgress?.quizPassed ? "✓" : "2."}
                  </span>
                  <span>Pass the quiz ({quiz?.passingScore}% required)</span>
                  {lessonProgress?.quizScore && (
                    <Badge className={lessonProgress.quizPassed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {lessonProgress.quizScore}%
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">3.</span>
                  <span>Unlock the next lesson</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={handleBackFromLesson}>
                Back to Lessons
              </Button>
              
              {!lessonProgress?.lessonCompleted ? (
                <Button 
                  onClick={() => handleStartLesson(selectedLesson)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Lesson
                </Button>
              ) : !lessonProgress?.quizPassed ? (
                <Button 
                  onClick={() => handleStartQuiz(selectedLesson)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  {lessonProgress?.quizCompleted ? 'Retake Quiz' : 'Take Quiz'}
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Lesson Completed!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show lessons overview
  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Learning Progress
          </CardTitle>
          <CardDescription>
            Complete lessons and pass quizzes to unlock new content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {progress.filter(p => p.quizPassed).length} of {lessons.length} lessons completed
              </span>
            </div>
            <Progress value={getOverallProgress()} className="h-3" />
            <div className="text-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {getOverallProgress()}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson, index) => {
          const lessonProgress = getLessonProgress(lesson.id);
          const isUnlocked = isLessonUnlocked(index);
          const quiz = getQuizByLessonId(lesson.id);
          
          return (
            <Card 
              key={lesson.id} 
              className={`transition-all duration-300 border-0 shadow-lg ${
                isUnlocked 
                  ? 'hover:shadow-xl hover:scale-105 cursor-pointer bg-white/90 dark:bg-slate-800/90' 
                  : 'opacity-60 bg-slate-100/90 dark:bg-slate-900/90'
              } ${lessonProgress?.quizPassed ? 'ring-2 ring-green-500/50' : ''}`}
              onClick={() => isUnlocked && setSelectedLesson(lesson)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      lessonProgress?.quizPassed 
                        ? 'bg-green-500' 
                        : isUnlocked 
                          ? 'bg-blue-500' 
                          : 'bg-slate-400'
                    }`}>
                      {lessonProgress?.quizPassed ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : isUnlocked ? (
                        <span className="text-white font-bold">{index + 1}</span>
                      ) : (
                        <Lock className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getDifficultyColor(lesson.difficulty)}>
                          {lesson.difficulty}
                        </Badge>
                        <span className="text-xs text-slate-500">{lesson.duration}</span>
                      </div>
                    </div>
                  </div>
                  {lessonProgress?.quizPassed && (
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {lessonProgress.quizScore}%
                      </div>
                      <div className="text-xs text-slate-500">Quiz Score</div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {lesson.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      lessonProgress?.lessonCompleted ? 'bg-green-500' : 'bg-slate-300'
                    }`}></div>
                    <span className={lessonProgress?.lessonCompleted ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}>
                      Interactive Lesson
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      lessonProgress?.quizPassed ? 'bg-green-500' : 'bg-slate-300'
                    }`}></div>
                    <span className={lessonProgress?.quizPassed ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}>
                      Quiz ({quiz?.passingScore}% to pass)
                    </span>
                  </div>
                </div>

                {!isUnlocked && (
                  <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                    Complete the previous lesson to unlock
                  </div>
                )}
                
                {isUnlocked && (
                  <Button 
                    className="w-full" 
                    variant={lessonProgress?.quizPassed ? "outline" : "default"}
                  >
                    {lessonProgress?.quizPassed ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Review Lesson
                      </>
                    ) : (
                      <>
                        {lessonProgress?.lessonCompleted ? 'Take Quiz' : 'Start Lesson'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
