import React from 'react';
import { Trophy, Target, Clock, RotateCcw, ArrowLeft, Star } from 'lucide-react';
import { Topic, Question } from '../../types/database';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface ResultsScreenProps {
  topic: Topic;
  questions: Question[];
  answers: string[];
  score: number;
  onRestart: () => void;
  onBack: () => void;
}

export function ResultsScreen({
  topic,
  questions,
  answers,
  score,
  onRestart,
  onBack,
}: ResultsScreenProps) {
  const totalQuestions = questions.length;
  const correctAnswers = questions.filter((q, index) => 
    answers[index] === q.correct_answer
  ).length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const maxScore = questions.reduce((sum, q) => sum + q.points, 0);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: '¡Excelente trabajo! 🌟', color: 'text-green-600' };
    if (percentage >= 70) return { message: '¡Muy bien! 👏', color: 'text-blue-600' };
    if (percentage >= 50) return { message: '¡Buen intento! 💪', color: 'text-orange-600' };
    return { message: '¡Sigue practicando! 📚', color: 'text-red-600' };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="max-w-2xl w-full px-4">
        <Card className="p-8 text-center">
          {/* Trophy Icon */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Trophy size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Ronda Completada!
            </h2>
            <h3 className="text-xl text-gray-700">
              {topic.title}
            </h3>
          </div>

          {/* Performance Message */}
          <div className="mb-8">
            <div className={`text-2xl font-bold mb-2 ${performance.color}`}>
              {performance.message}
            </div>
            <div className="text-lg text-gray-600">
              Has respondido {correctAnswers} de {totalQuestions} preguntas correctamente
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-blue-800">Puntos</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">{percentage}%</div>
              <div className="text-sm text-green-800">Aciertos</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-600">{correctAnswers}</div>
              <div className="text-sm text-purple-800">Correctas</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-orange-600">{questions.length - correctAnswers}</div>
              <div className="text-sm text-orange-800">Incorrectas</div>
            </div>
          </div>

          {/* Score Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Puntuación</span>
              <span>{score} / {maxScore}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${(score / maxScore) * 100}%` }}
              />
            </div>
          </div>

          {/* Achievements */}
          {percentage >= 80 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-yellow-800">
                <Star size={20} className="text-yellow-500" />
                <span className="font-semibold">¡Logro desbloqueado!</span>
                <Star size={20} className="text-yellow-500" />
              </div>
              <p className="text-yellow-700 text-sm mt-1">
                Has demostrado dominio en {topic.title}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onBack}
              variant="outline"
              icon={ArrowLeft}
              className="flex-1"
            >
              Volver al Inicio
            </Button>
            <Button
              onClick={onRestart}
              variant="primary"
              icon={RotateCcw}
              className="flex-1"
            >
              Intentar de Nuevo
            </Button>
          </div>

          {/* Encouragement */}
          <div className="mt-6 text-sm text-gray-500">
            {percentage < 70 ? (
              <p>💡 Tip: Revisa el tema con una sesión de estudio antes de intentar de nuevo</p>
            ) : (
              <p>🎯 ¡Excelente! Ahora puedes explorar otros temas</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}