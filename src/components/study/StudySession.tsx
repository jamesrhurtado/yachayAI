import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Volume2, Loader, AlertCircle } from 'lucide-react';
import { Topic } from '../../types/database';
import { useOpenAI } from '../../hooks/useOpenAI';
import { useElevenLabs } from '../../hooks/useElevenLabs';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface StudySessionProps {
  topic: Topic;
  onBack: () => void;
}

export function StudySession({ topic, onBack }: StudySessionProps) {
  const [studyContent, setStudyContent] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [additionalContext, setAdditionalContext] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [showDevPopup, setShowDevPopup] = useState(false); // Estado para controlar la visibilidad del popup

  const { generateStudyContent } = useOpenAI();
  const { generateAudio } = useElevenLabs();

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audio, audioUrl]);

  const handleGenerateContent = async () => {
    // Mostrar popup en lugar de ejecutar la función
    setShowDevPopup(true);
    
    // Cerrar el popup después de 5 segundos
    setTimeout(() => {
      setShowDevPopup(false);
    }, 5000);
    
    // No ejecutar el resto de la función
    return;

    // Código original que no se ejecutará
    /*
    try {
      setLoadingContent(true);
      const content = await generateStudyContent({ 
        topic, 
        additionalContext 
      });
      setStudyContent(content);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoadingContent(false);
    }
    */
  };

  const handleGenerateAudio = async () => {
    if (!studyContent) return;

    try {
      setLoadingAudio(true);
      const url = await generateAudio({ text: studyContent });
      setAudioUrl(url);
      
      const audioElement = new Audio(url);
      audioElement.addEventListener('loadedmetadata', () => {
        setDuration(audioElement.duration);
      });
      audioElement.addEventListener('timeupdate', () => {
        setCurrentTime(audioElement.currentTime);
      });
      audioElement.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
      
      setAudio(audioElement);
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      setLoadingAudio(false);
    }
  };

  const togglePlayback = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={onBack} variant="outline" icon={ArrowLeft}>
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{topic.title}</h1>
            <p className="text-gray-600">Sesión de estudio hablada</p>
          </div>
        </div>

        {/* Popup de desarrollo */}
        {showDevPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md mx-4 animate-fadeIn">
              <div className="flex items-center gap-4 mb-4">
                <AlertCircle className="text-amber-500" size={28} />
                <h3 className="text-xl font-bold text-gray-900">Función en desarrollo</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Esta funcionalidad aún está en proceso de desarrollo y no está disponible actualmente.
                Estamos trabajando para implementarla pronto.
              </p>
              <div className="flex justify-end">
                <Button 
                  onClick={() => setShowDevPopup(false)}
                  variant="primary"
                >
                  Entendido
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Setup Form */}
        {!studyContent && (
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Personaliza tu sesión de estudio
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Información adicional (opcional)
                </label>
                <textarea
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  placeholder="Ej: Estoy preparándome para un examen, necesito ejemplos de la vida real..."
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleGenerateContent}
                loading={loadingContent}
                size="lg"
                className="w-full"
              >
                Generar Contenido de Estudio
              </Button>
            </div>
          </Card>
        )}

        {/* Rest of the component remains unchanged */}
        {studyContent && (
          <div className="space-y-6">
            {/* Audio Player */}
            {audioUrl && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Audio de Estudio
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Volume2 size={16} />
                    <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-200"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center">
                    <Button
                      onClick={togglePlayback}
                      variant="secondary"
                      size="lg"
                      icon={isPlaying ? Pause : Play}
                    >
                      {isPlaying ? 'Pausar' : 'Reproducir'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Content Text */}
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Contenido de Estudio
                </h3>
                {!audioUrl && (
                  <Button
                    onClick={handleGenerateAudio}
                    loading={loadingAudio}
                    variant="secondary"
                    icon={Volume2}
                  >
                    Generar Audio
                  </Button>
                )}
              </div>

              <div className="prose prose-lg max-w-none">
                {studyContent.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => {
                    setStudyContent(null);
                    setAudioUrl(null);
                    setAudio(null);
                    setAdditionalContext('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Generar Nuevo Contenido
                </Button>
                <Button
                  onClick={onBack}
                  variant="primary"
                  className="flex-1"
                >
                  Continuar con Preguntas
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Loading States */}
        {loadingContent && (
          <Card className="p-8 text-center">
            <Loader className="animate-spin mx-auto mb-4" size={32} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Generando contenido...
            </h3>
            <p className="text-gray-600">
              Estamos preparando una explicación personalizada para ti
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}