import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Question } from '../../types/database';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [inputAnswer, setInputAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (option: string) => {
    if (showResult) return;
    setSelectedAnswer(option);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAnswer(e.target.value);
  };

  const handleSubmit = () => {
    if (question.question_type === "fill_in_the_blank" && !inputAnswer) return;
    if (question.question_type !== "fill_in_the_blank" && !selectedAnswer) return;
    
    setShowResult(true);
    
    // No longer automatically proceeding - user will click "Siguiente" button
  };

  const handleNextQuestion = () => {
    if (question.question_type === "fill_in_the_blank") {
      onAnswer(inputAnswer);
      setInputAnswer('');
    } else {
      onAnswer(selectedAnswer!);
      setSelectedAnswer(null);
    }
    setShowResult(false);
  };

  const checkFillInTheBlankAnswer = () => {
    if (!question.correct_answer || !inputAnswer) return false;
    
    // Get keywords from correct answer
    const keywords = question.correct_answer.toLowerCase().split(/[,\s]+/).filter(Boolean);
    const userInput = inputAnswer.toLowerCase();
    
    // Check if all important keywords are present in the answer
    return keywords.every(keyword => userInput.includes(keyword));
  };

  const isCorrect = question.question_type === "fill_in_the_blank" 
    ? checkFillInTheBlankAnswer() 
    : selectedAnswer === question.correct_answer;

  return (
    <Card className="p-8">
      <div className="space-y-6">
        {/* Question Text */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {question.question_text}
          </h3>
          <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 text-sm text-blue-700">
            <span>
              Tipo: {
                question.question_type === "multiple_choice" ? "Selecciona uno" : 
                question.question_type === "fill_in_the_blank" ? "Completar espacios" : 
                question.question_type === "true_false" ? "Verdadero/Falso" : 
                question.question_type
              }
            </span>
            <span>•</span>
            <span>{question.points} puntos</span>
          </div>
        </div>

        {/* Multiple Choice Options */}
        {question.question_type !== "fill_in_the_blank" && (
          <div className="grid gap-3">
            {question.options.map((option: string, index: number) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === question.correct_answer;
              
              let buttonClass = 'w-full p-4 text-left border-2 rounded-xl transition-all duration-200 ';
              
              if (showResult) {
                if (isCorrectOption) {
                  buttonClass += 'border-green-500 bg-green-50 text-green-800';
                } else if (isSelected && !isCorrectOption) {
                  buttonClass += 'border-red-500 bg-red-50 text-red-800';
                } else {
                  buttonClass += 'border-gray-200 bg-gray-50 text-gray-500';
                }
              } else if (isSelected) {
                buttonClass += 'border-blue-500 bg-blue-50 text-blue-800';
              } else {
                buttonClass += 'border-gray-200 hover:border-blue-300 hover:bg-blue-25 text-gray-700';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showResult && (
                      <div>
                        {isCorrectOption && (
                          <Check size={20} className="text-green-600" />
                        )}
                        {isSelected && !isCorrectOption && (
                          <X size={20} className="text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Fill in the Blank Input */}
        {question.question_type === "fill_in_the_blank" && (
          <div className="space-y-4">
            <input
              type="text"
              value={inputAnswer}
              onChange={handleInputChange}
              placeholder="Escribe tu respuesta aquí..."
              className={`w-full p-4 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${
                showResult 
                  ? isCorrect 
                    ? 'border-green-500 bg-green-50 ring-green-300'
                    : 'border-red-500 bg-red-50 ring-red-300'
                  : 'border-gray-300 focus:border-blue-400 focus:ring-blue-200'
              }`}
              disabled={showResult}
            />
            
            {showResult && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <span className="font-medium">Respuesta correcta:</span>
                <span className="text-green-600 font-medium">{question.correct_answer}</span>
              </div>
            )}
          </div>
        )}

        {/* Explanation (shown after answer) */}
        {showResult && question.explanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <h4 className="font-semibold text-blue-900 mb-2">Explicación:</h4>
            <p className="text-blue-800">{question.explanation}</p>
          </div>
        )}

        {/* Submit Button or Next Button */}
        <div className="text-center">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={
                (question.question_type === "fill_in_the_blank" && !inputAnswer) || 
                (question.question_type !== "fill_in_the_blank" && !selectedAnswer)
              }
              size="lg"
              className="px-12"
            >
              Confirmar Respuesta
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              size="lg"
              className="px-12 bg-blue-600 hover:bg-blue-700"
            >
              Siguiente
            </Button>
          )}
        </div>

        {/* Result Feedback */}
        {showResult && (
          <div className="text-center mt-4">
            <div className={`text-2xl font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? '¡Correcto! 🎉' : 'Incorrecto 😔'}
            </div>
            {isCorrect && (
              <p className="text-green-700">+{question.points} puntos</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}