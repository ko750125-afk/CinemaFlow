"use client";

import { useState } from "react";
import { useLearningStore } from "@/lib/store";
import { learningMetadata } from "@/lib/learning-meta";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Trophy, PlayCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { saveQuizAttempt } from "@/app/learn/actions";

interface LearnDashboardClientProps {
  quizHistory: any[];
}

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "shadcn/ui의 컴포넌트는 어떻게 설치하나요?",
    options: [
      "npm install shadcn-ui",
      "npx shadcn@latest add [component]",
      "yarn add @shadcn/components",
      "import { Button } from 'shadcn'"
    ],
    answerIndex: 1
  },
  {
    id: 2,
    question: "shadcn/ui의 특징 중 틀린 것은 무엇인가요?",
    options: [
      "접근성(a11y)을 기본으로 제공합니다.",
      "Tailwind CSS 기반으로 스타일링합니다.",
      "라이브러리로써 node_modules에 설치됩니다.",
      "코드를 직접 내 프로젝트에 복사하여 원하는 대로 수정할 수 있습니다."
    ],
    answerIndex: 2
  },
  {
    id: 3,
    question: "다음 중 CinemaFlow에서 사용된 컴포넌트가 아닌 것은?",
    options: [
      "Accordion",
      "Carousel",
      "Badge",
      "Tooltip"
    ],
    answerIndex: 0 // We haven't used Accordion actively in the core pages in our plan
  }
];

export function LearnDashboardClient({ quizHistory: initialQuizHistory }: LearnDashboardClientProps) {
  const learnedComponents = useLearningStore(state => state.learnedComponents);
  const totalComponents = Object.keys(learningMetadata).length;
  const progressPercentage = totalComponents === 0 ? 0 : Math.round((learnedComponents.length / totalComponents) * 100);

  const [quizHistory, setQuizHistory] = useState(initialQuizHistory);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const startQuiz = () => {
    setIsQuizActive(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsQuizFinished(false);
  };

  const handleNextQuestion = async () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === QUIZ_QUESTIONS[currentQuestionIndex].answerIndex;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Finish quiz
      setIsQuizFinished(true);
      
      // Save to server
      const res = await saveQuizAttempt(newScore, QUIZ_QUESTIONS.length, "basic");
      if (res.success) {
        toast.success("퀴즈 결과가 저장되었습니다.");
        setQuizHistory([{ score: newScore, total_questions: QUIZ_QUESTIONS.length, created_at: new Date().toISOString() }, ...quizHistory]);
      } else {
        toast.error("결과 저장 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2 space-y-8">
        
        {/* Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">학습 진도율</CardTitle>
            <CardDescription>전체 UI 컴포넌트 중 학습을 완료한 비율입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-3xl font-bold">{progressPercentage}%</span>
              <span className="text-muted-foreground">{learnedComponents.length} / {totalComponents} 개 완료</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </CardContent>
        </Card>

        {/* Components List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">컴포넌트 리스트</CardTitle>
            <CardDescription>서비스 내에서 사용된 컴포넌트들입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(learningMetadata).map(([id, meta]) => {
                const isLearned = learnedComponents.includes(id);
                return (
                  <div key={id} className={`flex items-start gap-3 p-3 rounded-lg border ${isLearned ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'}`}>
                    <div className="mt-0.5">
                      {isLearned ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        {meta.name}
                        {isLearned && <Badge variant="default" className="text-[10px] px-1.5 h-4">완료</Badge>}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{meta.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        {/* Quiz Area */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Trophy className="h-5 w-5 text-primary" />
              미니 퀴즈
            </CardTitle>
            <CardDescription>학습한 내용을 바탕으로 퀴즈에 도전해보세요!</CardDescription>
          </CardHeader>
          
          <CardContent>
            {!isQuizActive && !isQuizFinished ? (
              <div className="text-center py-6">
                <p className="mb-6 text-sm text-muted-foreground">총 {QUIZ_QUESTIONS.length}문제가 준비되어 있습니다.</p>
                <Button onClick={startQuiz} className="w-full h-12 text-lg">
                  <PlayCircle className="mr-2 h-5 w-5" /> 퀴즈 시작하기
                </Button>
              </div>
            ) : isQuizFinished ? (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 text-primary mb-2">
                  <span className="text-3xl font-bold">{score}/{QUIZ_QUESTIONS.length}</span>
                </div>
                <h3 className="text-xl font-bold">퀴즈 완료!</h3>
                <p className="text-sm text-muted-foreground mb-6">수고하셨습니다. 계속해서 컴포넌트를 학습해보세요.</p>
                <Button onClick={startQuiz} variant="outline" className="w-full">
                  다시 풀기
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>문제 {currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}</span>
                </div>
                <Progress value={((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100} className="h-1 mb-6" />
                
                <h3 className="font-semibold text-lg leading-snug">
                  {QUIZ_QUESTIONS[currentQuestionIndex].question}
                </h3>
                
                <div className="space-y-2 mt-4">
                  {QUIZ_QUESTIONS[currentQuestionIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAnswer(idx)}
                      className={`w-full text-left px-4 py-3 text-sm rounded-lg border transition-all ${
                        selectedAnswer === idx 
                          ? 'border-primary bg-primary text-primary-foreground font-medium' 
                          : 'border-border bg-card hover:bg-muted'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          {isQuizActive && !isQuizFinished && (
            <CardFooter>
              <Button 
                onClick={handleNextQuestion} 
                disabled={selectedAnswer === null} 
                className="w-full"
              >
                {currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? "결과 보기" : "다음 문제"}
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Quiz History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">퀴즈 기록</CardTitle>
          </CardHeader>
          <CardContent>
            {quizHistory.length > 0 ? (
              <div className="space-y-3">
                {quizHistory.map((attempt, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded bg-muted/40 text-sm">
                    <div>
                      <span className="font-semibold">{attempt.score}점</span>
                      <span className="text-muted-foreground text-xs ml-1">/ {attempt.total_questions}문제</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(attempt.created_at), 'MM.dd HH:mm')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-center text-muted-foreground py-4">아직 퀴즈 기록이 없습니다.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
