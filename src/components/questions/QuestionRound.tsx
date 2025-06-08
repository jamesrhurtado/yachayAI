import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Trophy, Target } from 'lucide-react';
import { Topic, Question, Subject, Grade } from '../../types/database';
import { useOpenAI } from '../../hooks/useOpenAI';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { QuestionCard } from './QuestionCard';
import { ResultsScreen } from './ResultsScreen';

interface QuestionRoundProps {
  grade: Grade;
  topic: Topic;
  subject: Subject;
  onComplete: () => void;
  onBack: () => void;
}

export function QuestionRound({ grade, topic, subject, onComplete, onBack }: QuestionRoundProps) {
  const hasRequestedRef = useRef(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [gameStarted, setGameStarted] = useState(false);
  console.log("[MiComponente] render"); 

  const { generateQuestions } = useOpenAI();

  useEffect(() => {
    // Only load questions if they haven't been requested yet
    if (!hasRequestedRef.current) {
      console.log("Requesting questions - first time only");
      hasRequestedRef.current = true;
      loadQuestions();
    } else {
      console.log("Skipping duplicate request");
    }
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleComplete();
    }
  }, [timeLeft, gameStarted, showResults]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const generatedQuestions = await generateQuestions({ 
        grade,
        topic,
        subject, 
        count: 5,
        difficulty: topic.difficulty_level 
      });
      
      setQuestions(generatedQuestions as Question[]);
    } catch (err) {
      setError('Error generating questions. Please try again.');
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correct_answer;
    
    setAnswers([...answers, answer]);
    
    if (isCorrect) {
      setScore(score + currentQuestion.points);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setShowResults(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Generando preguntas...
          </h3>
          <p className="text-gray-600">
            Estamos creando preguntas personalizadas para ti
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="text-red-500 mb-4">
            <Target size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar preguntas
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3">
            <Button onClick={loadQuestions} className="flex-1">
              Reintentar
            </Button>
            <Button variant="outline" onClick={onBack} className="flex-1">
              Volver
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (showResults) {
    return (
      <ResultsScreen
        topic={topic}
        questions={questions}
        answers={answers}
        score={score}
        onRestart={() => {
          setCurrentQuestionIndex(0);
          setAnswers([]);
          setScore(0);
          setShowResults(false);
          setTimeLeft(300);
          setGameStarted(false);
          loadQuestions();
        }}
        onBack={onComplete}
      />
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-lg">
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Trophy size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Ronda de Preguntas!
            </h2>
            <h3 className="text-xl text-gray-700 mb-4">
              {topic.title}
            </h3>
            <p className="text-gray-600">
              {topic.description}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Target size={16} />
                Preguntas:
              </span>
              <span className="font-semibold">{questions.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Clock size={16} />
                Tiempo:
              </span>
              <span className="font-semibold">5 minutos</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Trophy size={16} />
                Puntos máximos:
              </span>
              <span className="font-semibold">
                {questions.reduce((sum, q) => sum + q.points, 0)} pts
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={onBack} variant="outline" icon={ArrowLeft}>
              Volver
            </Button>
            <Button 
              onClick={() => setGameStarted(true)} 
              className="flex-1"
              size="lg"
            >
              ¡Comenzar!
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" icon={ArrowLeft}>
            Salir
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">{topic.title}</h2>
            <p className="text-sm text-gray-600">
              Pregunta {currentQuestionIndex + 1} de {questions.length}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">{score} pts</div>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <Clock size={14} />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Progress */}
        <ProgressBar progress={progress} className="mb-8" />

        {/* Question */}
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
}