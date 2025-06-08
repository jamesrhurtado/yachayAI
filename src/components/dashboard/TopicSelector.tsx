import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Grade, Subject, Topic } from '../../types/database';
import { Card } from '../ui/Card';

interface TopicSelectorProps {
  grades: Grade[];
  subjects: Subject[];
  selectedGrade: Grade | null;
  selectedSubject: Subject | null;
  onGradeSelect: (grade: Grade) => void;
  onSubjectSelect: (subject: Subject) => void;
  onTopicSelect: (topic: Topic) => void;
}

export function TopicSelector({
  grades,
  subjects,
  selectedGrade,
  selectedSubject,
  onGradeSelect,
  onSubjectSelect,
  onTopicSelect,
}: TopicSelectorProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);

  useEffect(() => {
    if (selectedGrade && selectedSubject) {
      fetchTopics();
    }
  }, [selectedGrade, selectedSubject]);

  const fetchTopics = async () => {
    if (!selectedGrade || !selectedSubject) return;

    setLoadingTopics(true);
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('grade_id', selectedGrade.id)
        .eq('subject_id', selectedSubject.id)
        .order('difficulty_level');

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoadingTopics(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Grade Selection */}
      {!selectedGrade && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Selecciona tu grado
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
            {grades.map((grade) => (
              <Card
                key={grade.id}
                hover
                className="p-6 text-center"
                onClick={() => onGradeSelect(grade)}
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {grade.display_name}
                </div>
                <ChevronRight size={24} className="mx-auto text-gray-400" />
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Subject Selection */}
      {selectedGrade && !selectedSubject && (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedGrade.display_name} - Selecciona el área
            </h2>
            <button
              onClick={() => onGradeSelect(null as any)}
              className="text-blue-600 hover:text-blue-700 text-sm mt-2"
            >
              ← Cambiar grado
            </button>
          </div>
          <div className="grid gap-4 max-w-md mx-auto">
            {subjects.map((subject) => (
              <Card
                key={subject.id}
                hover
                className="p-6"
                onClick={() => onSubjectSelect(subject)}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: subject.color + '20' }}
                  >
                    <BookOpen size={24} style={{ color: subject.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{subject.name}</h3>
                    <p className="text-sm text-gray-600">{subject.description}</p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Topic Selection */}
      {selectedGrade && selectedSubject && (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedGrade.display_name} - {selectedSubject.name}
            </h2>
            <button
              onClick={() => onSubjectSelect(null as any)}
              className="text-blue-600 hover:text-blue-700 text-sm mt-2"
            >
              ← Cambiar área
            </button>
          </div>

          {loadingTopics ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <Card
                  key={topic.id}
                  hover
                  className="p-6"
                  onClick={() => onTopicSelect(topic)}
                >
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-900">{topic.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {topic.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Nivel {topic.difficulty_level}/5</span>
                      <span>{topic.estimated_duration} min</span>
                    </div>
                    <div className="pt-2">
                      <ChevronRight size={20} className="text-blue-500 ml-auto" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}