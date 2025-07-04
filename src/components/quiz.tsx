'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, Trophy, ArrowRight, ArrowLeft } from 'lucide-react';

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number; // percentage
  timeLimit?: number; // in minutes
}

interface QuizProps {
  quiz: Quiz;
  onComplete: (passed: boolean, score: number) => void;
  onBack: () => void;
}

export function QuizComponent({ quiz, onComplete, onBack }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number | boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeLeft !== null && timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev && prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, timeLeft, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (answer: string | number | boolean) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      handleSubmitQuiz();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    
    quiz.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
    
    const passed = finalScore >= quiz.passingScore;
    onComplete(passed, finalScore);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0 shadow-xl">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl md:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {quiz.title}
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 dark:text-slate-300 mt-2">
              {quiz.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {quiz.questions.length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Questions</div>
              </div>
              <div className="text-center p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {quiz.passingScore}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Passing Score</div>
              </div>
              <div className="text-center p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {quiz.timeLimit ? `${quiz.timeLimit} min` : '∞'}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Time Limit</div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">Quiz Instructions:</h3>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Answer all questions to the best of your ability</li>
                <li>• You need {quiz.passingScore}% to pass and unlock the next lesson</li>
                {quiz.timeLimit && <li>• You have {quiz.timeLimit} minutes to complete the quiz</li>}
                <li>• You can review your answers before submitting</li>
                <li>• You can retake the quiz if you don't pass</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={onBack} className="px-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Lesson
              </Button>
              <Button onClick={handleStartQuiz} className="px-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                Start Quiz
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const passed = score >= quiz.passingScore;
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className={`border-0 shadow-xl ${
          passed 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' 
            : 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20'
        }`}>
          <CardHeader className="text-center pb-8">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              passed 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : 'bg-gradient-to-r from-red-500 to-pink-500'
            }`}>
              {passed ? (
                <CheckCircle className="h-10 w-10 text-white" />
              ) : (
                <XCircle className="h-10 w-10 text-white" />
              )}
            </div>
            <CardTitle className={`text-3xl md:text-4xl ${
              passed 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {passed ? 'Congratulations!' : 'Quiz Not Passed'}
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 dark:text-slate-300 mt-2">
              {passed 
                ? 'You have successfully completed the quiz!' 
                : 'You need to score at least ' + quiz.passingScore + '% to pass.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-6xl font-bold mb-2 ${
                passed 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {score}%
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                Your Score ({quiz.questions.filter(q => answers[q.id] === q.correctAnswer).length} out of {quiz.questions.length} correct)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {quiz.questions.filter(q => answers[q.id] === q.correctAnswer).length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Correct Answers</div>
              </div>
              <div className="text-center p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg">
                <div className="text-xl font-bold text-red-600 dark:text-red-400">
                  {quiz.questions.filter(q => answers[q.id] !== q.correctAnswer).length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Incorrect Answers</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              {!passed && (
                <Button 
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setAnswers({});
                    setShowResults(false);
                    setQuizStarted(false);
                    setTimeLeft(quiz.timeLimit ? quiz.timeLimit * 60 : null);
                  }}
                  className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Retake Quiz
                </Button>
              )}
              <Button variant="outline" onClick={onBack} className="px-6">
                {passed ? 'Continue Learning' : 'Back to Lesson'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header */}
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{quiz.title}</CardTitle>
              <CardDescription>
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                {currentQuestion.difficulty}
              </Badge>
              {timeLeft !== null && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className={timeLeft < 60 ? 'text-red-500 font-bold' : ''}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={answers[currentQuestion.id] === index ? "default" : "outline"}
                  className="w-full text-left justify-start h-auto p-4 text-wrap"
                  onClick={() => handleAnswerSelect(index)}
                >
                  <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'true-false' && (
            <div className="space-y-3">
              <Button
                variant={answers[currentQuestion.id] === true ? "default" : "outline"}
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => handleAnswerSelect(true)}
              >
                <span className="mr-3 font-bold">A.</span>
                True
              </Button>
              <Button
                variant={answers[currentQuestion.id] === false ? "default" : "outline"}
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => handleAnswerSelect(false)}
              >
                <span className="mr-3 font-bold">B.</span>
                False
              </Button>
            </div>
          )}

          {showExplanation && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Explanation:</h4>
              <p className="text-blue-700 dark:text-blue-300">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-6">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {answers[currentQuestion.id] !== undefined && !showExplanation && (
                <Button
                  variant="outline"
                  onClick={() => setShowExplanation(true)}
                >
                  Show Explanation
                </Button>
              )}
              <Button
                onClick={handleNextQuestion}
                disabled={answers[currentQuestion.id] === undefined}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {isLastQuestion ? 'Submit Quiz' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
