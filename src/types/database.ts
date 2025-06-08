export interface Database {
  public: {
    Tables: {
      grades: {
        Row: {
          id: string;
          name: string;
          display_name: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          display_name: string;
          order_index: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          display_name?: string;
          order_index?: number;
          created_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string;
          color: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string;
          color?: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon?: string;
          color?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      topics: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          grade_id: string;
          subject_id: string;
          curriculum_code: string | null;
          difficulty_level: number;
          estimated_duration: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          grade_id: string;
          subject_id: string;
          curriculum_code?: string | null;
          difficulty_level?: number;
          estimated_duration?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          grade_id?: string;
          subject_id?: string;
          curriculum_code?: string | null;
          difficulty_level?: number;
          estimated_duration?: number;
          created_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          topic_id: string;
          question_text: string;
          question_type: string;
          options: any;
          correct_answer: string;
          explanation: string | null;
          difficulty: number;
          points: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          topic_id: string;
          question_text: string;
          question_type?: string;
          options?: any;
          correct_answer: string;
          explanation?: string | null;
          difficulty?: number;
          points?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          topic_id?: string;
          question_text?: string;
          question_type?: string;
          options?: any;
          correct_answer?: string;
          explanation?: string | null;
          difficulty?: number;
          points?: number;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          grade_id: string | null;
          total_points: number;
          level: number;
          streak_days: number;
          last_activity_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          avatar_url?: string | null;
          grade_id?: string | null;
          total_points?: number;
          level?: number;
          streak_days?: number;
          last_activity_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          avatar_url?: string | null;
          grade_id?: string | null;
          total_points?: number;
          level?: number;
          streak_days?: number;
          last_activity_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          topic_id: string;
          questions_answered: number;
          questions_correct: number;
          total_points: number;
          completion_percentage: number;
          last_studied_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          topic_id: string;
          questions_answered?: number;
          questions_correct?: number;
          total_points?: number;
          completion_percentage?: number;
          last_studied_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          topic_id?: string;
          questions_answered?: number;
          questions_correct?: number;
          total_points?: number;
          completion_percentage?: number;
          last_studied_at?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Grade = Database['public']['Tables']['grades']['Row'];
export type Subject = Database['public']['Tables']['subjects']['Row'];
export type Topic = Database['public']['Tables']['topics']['Row'];
export type Question = Database['public']['Tables']['questions']['Row'];
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type UserProgress = Database['public']['Tables']['user_progress']['Row'];