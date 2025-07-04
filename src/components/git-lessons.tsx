'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { InteractiveLesson } from "./interactive-lesson";

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
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartLesson = () => {
    if (selectedLesson) {
      setIsInInteractiveMode(true);
    }
  };

  const handleCompleteLesson = () => {
    if (selectedLesson && !completedLessons.includes(selectedLesson.id)) {
      setCompletedLessons([...completedLessons, selectedLesson.id]);
    }
    setIsInInteractiveMode(false);
    setSelectedLesson(null);
  };

  const handleBackToLessons = () => {
    setIsInInteractiveMode(false);
    setSelectedLesson(null);
  };

  const handleBackFromLesson = () => {
    setSelectedLesson(null);
  };

  const progressPercentage = (completedLessons.length / lessons.length) * 100;

  // Show interactive lesson
  if (isInInteractiveMode && selectedLesson) {
    return (
      <InteractiveLesson
        lessonId={selectedLesson.id}
        onComplete={handleCompleteLesson}
        onBack={() => setIsInInteractiveMode(false)}
      />
    );
  }

  // Show lesson details
  if (selectedLesson) {
    const isCompleted = completedLessons.includes(selectedLesson.id);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBackFromLesson}>
            ← Back to Lessons
          </Button>
          <div className="flex gap-2">
            <Badge className={getDifficultyColor(selectedLesson.difficulty)}>
              {selectedLesson.difficulty}
            </Badge>
            {isCompleted && (
              <Badge className="bg-green-100 text-green-800">
                ✓ Completed
              </Badge>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedLesson.title}
              {isCompleted && <span className="text-green-500">✓</span>}
            </CardTitle>
            <CardDescription>{selectedLesson.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              
              {/* Lesson Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">What you'll learn:</h3>
                  <ul className="space-y-2">
                    {selectedLesson.topics.map((topic, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Commands you'll practice:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLesson.commands.map((command, index) => (
                      <Badge key={index} variant="outline" className="font-mono text-xs">
                        {command}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lesson Stats */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{selectedLesson.duration}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Duration</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{selectedLesson.topics.length}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Topics</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{selectedLesson.commands.length}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Commands</div>
                  </div>
                </div>
              </div>

              {/* Interactive Preview */}
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center">
                <div className="space-y-3">
                  <div className="text-4xl">🎮</div>
                  <h3 className="text-lg font-semibold">Interactive Learning Experience</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    This lesson includes step-by-step interactive modules where you'll execute real Git commands 
                    and see exactly what happens to your repository state.
                  </p>
                </div>
              </div>

              {/* Start Lesson Button */}
              <div className="pt-4">
                <Button onClick={handleStartLesson} className="w-full" size="lg">
                  {isCompleted ? '🔄 Review Lesson' : '🚀 Start Interactive Lesson'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show lessons overview
  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Progress</CardTitle>
          <CardDescription>
            {completedLessons.length} of {lessons.length} lessons completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="w-full" />
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {Math.round(progressPercentage)}% complete
          </p>
        </CardContent>
      </Card>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson) => {
          const isCompleted = completedLessons.includes(lesson.id);
          
          return (
            <Card 
              key={lesson.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedLesson(lesson)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {lesson.title}
                    {isCompleted && <span className="text-green-500">✓</span>}
                  </CardTitle>
                  <Badge className={getDifficultyColor(lesson.difficulty)}>
                    {lesson.difficulty}
                  </Badge>
                </div>
                <CardDescription>{lesson.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Duration:</span>
                    <span>{lesson.duration}</span>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Topics covered:</p>
                    <div className="flex flex-wrap gap-1">
                      {lesson.topics.slice(0, 3).map((topic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {lesson.topics.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{lesson.topics.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button 
                      variant={isCompleted ? "secondary" : "default"} 
                      className="w-full"
                    >
                      {isCompleted ? "✓ Review Lesson" : "Start Lesson"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Learning Path */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Learning Path</CardTitle>
          <CardDescription>Follow this path for the best learning experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lessons.map((lesson, index) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isAvailable = index === 0 || completedLessons.includes(lessons[index - 1].id);
              
              return (
                <div key={lesson.id} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isAvailable
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{lesson.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{lesson.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getDifficultyColor(lesson.difficulty)}>
                      {lesson.difficulty}
                    </Badge>
                    {isCompleted && (
                      <Badge className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
