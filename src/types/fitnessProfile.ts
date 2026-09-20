export type FitnessProfile = {
  id: string;
  user_id: string;
  domain: string;
  goal: string;
  experience_level: string;
  training_location: string;
  equipment: string[];
  days_per_week: number;
  minutes_per_session: number;
  limitations: string | null;
  preference: string;
  created_at: string;
  updated_at: string;
};

export type OnboardingAnswers = {
  goal: string;
  experience_level: string;
  training_location: string;
  equipment: string[];
  days_per_week: number | null;
  minutes_per_session: number | null;
  limitations: string;
  preference: string;
};

export const emptyOnboardingAnswers: OnboardingAnswers = {
  goal: "",
  experience_level: "",
  training_location: "",
  equipment: [],
  days_per_week: null,
  minutes_per_session: null,
  limitations: "",
  preference: "",
};
