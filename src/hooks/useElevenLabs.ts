import { useState } from 'react';

interface GenerateAudioParams {
  text: string;
  voiceId?: string;
}

export function useElevenLabs() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAudio = async ({ 
    text, 
    voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID 
  }: GenerateAudioParams): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.0,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Error generating audio');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      return audioUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error generating audio';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    generateAudio,
    loading,
    error,
  };
}