import React, { useState, useEffect } from 'react';
import { BookOpen, Headphones, Trophy, Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Grade, Subject, Topic } from '../../types/database';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TopicSelector } from './TopicSelector';
import { QuestionRound } from '../questions/QuestionRound';
import { StudySession } from '../study/StudySession';

export function Dashboard() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [mode, setMode] = useState<'questions' | 'study' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [gradesRes, subjectsRes] = await Promise.all([
        supabase.from('grades').select('*').order('order_index'),
        supabase.from('subjects').select('*')
      ]);

      if (gradesRes.data) setGrades(gradesRes.data);
      if (subjectsRes.data) setSubjects(subjectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuestions = () => {
    if (!loading && selectedGrade && selectedSubject && selectedTopic) {
      setMode('questions');
    }
  };

  const handleStartStudy = () => {
    setMode('study');
  };

  const handleBackToDashboard = () => {
    setMode(null);
    setSelectedTopic(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (mode === 'questions' && selectedGrade && selectedSubject && selectedTopic) {
    return (
      <QuestionRound
        grade={selectedGrade}
        topic={selectedTopic}
        subject={selectedSubject}
        onComplete={handleBackToDashboard}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (mode === 'study' && selectedTopic) {
    return (
      <StudySession 
        topic={selectedTopic} 
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¡Bienvenido a tu aventura de aprendizaje! 🚀
          </h1>
          <p className="text-xl text-gray-600">
            Explora, aprende y diviértete con la ciencia y tecnología
          </p>
        </div>

        {/* Topic Selection */}
        {!selectedTopic ? (
          <TopicSelector
            grades={grades}
            subjects={subjects}
            selectedGrade={selectedGrade}
            selectedSubject={selectedSubject}
            onGradeSelect={setSelectedGrade}
            onSubjectSelect={setSelectedSubject}
            onTopicSelect={setSelectedTopic}
          />
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Selected Topic Display */}
            <Card className="p-8 mb-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedTopic.title}
                </h2>
                <p className="text-lg text-gray-600">
                  {selectedTopic.description}
                </p>
                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Target size={16} />
                    Dificultad: {selectedTopic.difficulty_level}/5
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy size={16} />
                    {selectedTopic.estimated_duration} min
                  </span>
                </div>
              </div>

              {/* Mode Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card hover className="p-6" onClick={handleStartQuestions}>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <BookOpen size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Ronda de Preguntas
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Pon a prueba tus conocimientos con preguntas interactivas
                    </p>
                    <Button variant="primary" className="w-full">
                      Comenzar Ronda
                    </Button>
                  </div>
                </Card>

                <Card hover className="p-6" onClick={handleStartStudy}>
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Headphones size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Sesión de Estudio
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Escucha una explicación completa del tema
                    </p>
                    <Button variant="secondary" className="w-full">
                      Iniciar Sesión
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTopic(null)}
                >
                  Cambiar Tema
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
