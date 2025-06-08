# YachayAI - Plataforma Educativa Inteligente para Perú

## Descripción

YachayAI es una plataforma educativa gamificada con inteligencia artificial diseñada para estudiantes de primaria en Perú, enfocada en el área de Ciencia y Tecnología según el currículo del Ministerio de Educación (Minedu). Inspirada en aplicaciones de aprendizaje interactivo como Duolingo, la plataforma ofrece contenido educativo personalizado y accesible para reducir la brecha educativa en áreas con recursos limitados.

## Características Principales

- **Sesiones de Preguntas Interactivas:** Preguntas de opción múltiple, completar espacios y verdadero/falso, generadas dinámicamente mediante IA.
- **Contenido Alineado al Currículo:** Material educativo que sigue los estándares oficiales del Minedu para 5° y 6° de primaria.
- **Estudio Guiado:** Sesiones de estudio en formato narrativo que explican conceptos científicos de manera amigable.
- **Interfaz Gamificada:** Sistema de puntos y retroalimentación instantánea que motiva el aprendizaje autónomo.
- **Culturalmente Relevante:** Contenido adaptado al contexto peruano, con ejemplos locales y lenguaje apropiado.

## Tecnologías Utilizadas

- **Frontend:** React con TypeScript y Tailwind CSS para una interfaz responsiva
- **Backend:** Supabase para autenticación y almacenamiento de datos
- **IA:** Azure OpenAI para la generación de contenido educativo personalizado
- **TTS:** ElevenLabs para convertir texto a voz (sesiones de estudio)

## Importancia para la Educación Peruana

YachayAI busca democratizar el acceso a educación de calidad, especialmente en áreas rurales donde:

- **Recursos Limitados:** Muchas escuelas carecen de materiales didácticos actualizados y docentes especializados.
- **Desigualdad Educativa:** Existe una brecha significativa en la calidad educativa entre zonas urbanas y rurales.
- **Necesidad de Autonomía:** Los estudiantes necesitan herramientas que fomenten el aprendizaje independiente.
- **Pertinencia Cultural:** El contenido educativo debe reflejar el contexto local para ser efectivo.

La plataforma proporciona una solución tecnológica accesible que complementa la labor docente, permitiendo a los estudiantes reforzar sus conocimientos en ciencia mediante actividades interactivas y culturalmente relevantes.

## Cómo Funciona

1. El estudiante selecciona su grado, asignatura y tema específico
2. Puede elegir entre:
   - Responder una ronda de preguntas interactivas
   - Acceder a una sesión de estudio guiada
3. Al completar actividades, recibe retroalimentación inmediata y acumula puntos

## Estado del Proyecto

YachayAI se encuentra en fase de desarrollo y cuenta con funcionalidades básicas implementadas. La aplicación presenta una estructura escalable para incorporar más grados y asignaturas en el futuro.

## Planes Futuros

- Soporte offline para áreas con conectividad limitada
- Inclusión de otros idiomas nativos como quechua
- Expansión a otras materias del currículo nacional
- Desarrollo de módulos de análisis para docentes y tutores

## Instalación y Configuración

1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Copiar el archivo `.env.example` a `.env` y configurar las variables de entorno
4. Iniciar el servidor de desarrollo: `npm run dev`

---

**YachayAI:** Empoderando a estudiantes peruanos con educación accesible, interactiva y culturalmente relevante.