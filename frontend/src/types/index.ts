export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Novel {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  created_at: string;
  chapter_count?: number;
}

export interface Chapter {
  id: number;
  novel_id: number;
  chapter_number: number;
  title: string;
  content: string;
  word_count: number;
  created_at: string;
}

export interface AIReview {
  id: number;
  chapter_id: number;
  persona_id: number;
  persona_name: string;
  persona_type: string;
  review_text: string;
  rating: number;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
