
export interface GiftRecommendation {
  id: string;
  giftName: string;
  whyItFits: string;
  budgetCategory: string;
  alternatives: string[];
  type: string;
  targetAudience: string;
}

export interface UserInput {
  age: string;
  occasion: string;
  hobbies: string;
  budget: string;
}

export interface AppState {
  loading: boolean;
  recommendations: GiftRecommendation[];
  favorites: GiftRecommendation[];
  error: string | null;
}
