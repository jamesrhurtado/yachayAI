import { useState, useRef } from 'react';
import { Grade, Question, Subject, Topic } from '../types/database';
import { AzureOpenAI } from 'openai';

interface GenerateQuestionsParams {
  grade: Grade;
  topic: Topic;
  subject: Subject;
  count?: number;
  difficulty?: number;
}

interface GenerateStudyContentParams {
  topic: Topic;
  additionalContext?: string;
}

export function useOpenAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestInProgressRef = useRef(false);

  // Initialize the Azure OpenAI client
  const azureClient = new AzureOpenAI({
    apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY,
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || "https://the-james-dev-ai.openai.azure.com/",
    apiVersion: "2025-01-01-preview",
    deployment: "o3-mini", // Make sure this matches your deployment name
    dangerouslyAllowBrowser: true // Required for client-side usage
  });

  const generateQuestions = async ({ 
    grade,
    topic,
    subject, 
    count = 5, 
    difficulty = 1 
  }: GenerateQuestionsParams): Promise<Omit<Question, 'id' | 'created_at'>[]> => {
    if (requestInProgressRef.current) {
      console.log("Request already in progress");
      return [];
    }

    requestInProgressRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const prompt = `
Genera ${count} preguntas educativas para estudiantes de primaria sobre el tema: "${topic.title}".
Estas preguntas deben ser apropiadas para estudiantes de ${grade.display_name}, en el curso de ${subject.name} y seguir el currículo peruano del Ministerio de Educación (Minedu).
Puedes usar la siguiente información, pero tambien puedes indagar más sobre el tema, solo recuerda el grado y el curso
Descripción del tema: ${topic.description}
Nivel de dificultad: ${difficulty}/5
Código curricular: ${topic.curriculum_code}

Cada pregunta debe seguir el currículo peruano del Ministerio de Educación (Minedu).

Tipos de preguntas a generar:
- Opción múltiple (4 opciones): "question_type": "multiple_choice",
- Completar espacios: "question_type": "fill_in_the_blank",
- Verdadero/Falso: "question_type": "true_false",

La respuesta debe estar en formato JSON válido, asegúrate de escapar correctamente las comillas dentro de las cadenas de texto.
Formato de respuesta JSON:
{
  "questions": [
    {
      "question_text": "¿Cuál es la función principal del núcleo celular?",
      "question_type": "multiple_choice",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correct_answer": "Opción A",
      "explanation": "Explicación clara y educativa",
      "difficulty": 1,
      "points": 10
    }
  ]
}

Las preguntas deben ser:
- Apropiadas para la edad
- Culturalmente relevantes para Perú
- Educativas y motivadoras
- Con explicaciones claras

Importante: Asegúrate de que tu respuesta sea un JSON válido sin errores de sintaxis.
`;

      // Use the Azure OpenAI SDK for the request
      const response = await azureClient.chat.completions.create({
        model: "o3-mini", // Use your deployment/model name here
        messages: [
          {
            role: "developer",
            content: "Eres un experto en educación primaria peruana especializado en crear contenido educativo interactivo según el currículo del Minedu. Es crucial que tus respuestas en formato JSON sean siempre válidas sintácticamente."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_completion_tokens: 100000, // Note: use max_completion_tokens instead of max_tokens for Azure
      });

      // Access the content property directly from the response
      const responseContent = response.choices[0].message.content;
      if (!responseContent) {
        throw new Error('Empty response from Azure OpenAI');
      }
      console.log('Raw response from Azure OpenAI:', responseContent);
      
      // Safer JSON parsing with error handling
      let content;
      try {
        // Find JSON content within the response (in case there's extra text)
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          content = JSON.parse(jsonMatch[0]);
        } else {
          content = JSON.parse(responseContent);
        }
        
        // Validate the expected structure
        if (!content.questions || !Array.isArray(content.questions)) {
          throw new Error('Invalid response format: missing questions array');
        }
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Raw response:', responseContent);
        throw new Error(`Error parsing JSON response: ${parseError}`);
      }
      
      return content.questions.map((q: any) => ({
        ...q,
        topic_id: topic.id,
      }));
    } catch (err) {
      console.error('Azure OpenAI API error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error generating questions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
      requestInProgressRef.current = false;
    }
  };

  const generateStudyContent = async ({ 
    topic, 
    additionalContext = '' 
  }: GenerateStudyContentParams): Promise<string> => {
    if (requestInProgressRef.current) {
      console.log("Request already in progress");
      return "Request already in progress. Please wait.";
    }

    requestInProgressRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const prompt = `
Crea un guión de estudio hablado (tipo podcast educativo) de 5-10 minutos sobre el tema: "${topic.title}".

Descripción del tema: ${topic.description}
Contexto adicional: ${additionalContext}
Código curricular: ${topic.curriculum_code}

El contenido debe:
- Ser apropiado para estudiantes de primaria peruanos
- Incluir ejemplos locales y culturalmente relevantes
- Ser engaging y fácil de entender
- Tener un tono amigable y motivador
- Incluir analogías y ejemplos prácticos
- Durar entre 5-10 minutos cuando se lea en voz alta

Estructura sugerida:
1. Introducción atractiva
2. Desarrollo del tema con ejemplos
3. Datos curiosos
4. Aplicación en la vida real
5. Resumen y mensaje motivador

El guión debe estar listo para ser convertido a audio.
`;

      const response = await azureClient.chat.completions.create({
        model: "o3-mini", // Use your deployment/model name here
        messages: [
          {
            role: "developer",
            content: "Eres un experto en educación primaria peruana especializado en crear contenido educativo audio para estudiantes. Tu contenido debe ser culturalmente relevante y seguir el currículo del Minedu."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_completion_tokens: 2500 // Using max_completion_tokens for Azure
      });

      // Access the content property directly from the response
      const responseContent = response.choices[0].message.content;
      if (!responseContent) {
        throw new Error('Empty response from Azure OpenAI');
      }
      console.log('Raw response from Azure OpenAI:', responseContent);
      
      return responseContent;
    } catch (err) {
      console.error('Azure OpenAI API error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error generating study content';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
      requestInProgressRef.current = false;
    }
  };

  return {
    generateQuestions,
    generateStudyContent,
    loading,
    error,
  };
}