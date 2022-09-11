export type SignUpRequest = {
  password: string;
  email: string;
  first_name: string;
  timezone: string;
};

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  daily_kcal: number;
  daily_carbs_pct: number;
  daily_fat_pct: number;
  daily_protein_pct: number;
  username: string | null;
  ref: null;
  birth_year: number;
  gender: string;
  email: string;
  oauths: string[];
  coach: {is_active: number; code: string};
  mobile_number: string | null;
  enable_weekday_sms: number;
  enable_review_foods: number | null;
  is_activated: number;
  created_at: string;
  timezone: string;
  account_setup: string;
  default_nutrient: number;
  default_nutrient_value: number;
  grocery_agent: number;
  height_cm: number;
  weight_kg: number;
  country_code: null;
  measure_system: number;
  exercise_level: number;
  show_meal_type: number;
  nutrPrefs: [{nutr_id: number; goal: number}];
  push_enabled: number;
  weekday_reminders_enabled: number;
  weekend_reminders_enabled: number;
  premium_user: number;
  nutrition_topics: [];
  remote_ids: {};
};

export type UserData = {userData: User; userJWT: string};
