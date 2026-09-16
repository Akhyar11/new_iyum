export interface Package {
  id: string;
  code: string;
  name: string;
  price: number;
  description: string;
  photo_url: string;
  facilities: string[];
  status: 'active' | 'inactive';
  category?: string;
  notes?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Criterion {
  id: string;
  name: string;
  weight: number; // percentage (sum = 100)
}

export interface Option {
  id: string;
  question_id: string;
  text: string;
  order_index: number;
}

export interface Question {
  id: string;
  criteria_id: string;
  text: string;
  order_index: number;
  options: Option[];
}

export interface RecommendationResult {
  package_id: string;
  package: Package;
  final_score: number;
  rank: number;
}
