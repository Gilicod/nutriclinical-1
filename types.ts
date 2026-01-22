export type Role = 'admin' | 'patient';

export interface User {
  id: string;
  email: string;
  password?: string; // stored plainly for demo purposes
  name: string;
  role: Role;
  patientId?: string; // Link user to patient profile if role is patient
}

export interface Note {
  id: string;
  date: string;
  objective: string;
  observations: string;
  images?: string[]; // Changed to array
}

export interface Lifestyle {
  activity: {
    regular: boolean;
    details: string;
  };
  sleep: {
    hours: string;
    stress: string;
  };
  diet: {
    meals: string;
    water: string;
    alcohol: boolean;
    tobacco: boolean;
  };
  // New fields from screenshot
  bowelMovement?: string; // Estreñimiento
  
  preferences: {
    likes: string;
    dislikes: string;
    budget: 'Bajo' | 'Medio' | 'Alto';
    access: string;
    eatingOut: string;
  };
}

export interface Anthropometry {
  id: string;
  date: string;
  weight: number;
  height: number;
  imc: number;
  circumference: {
    waist: number;
    hip: number;
    abdomen: number;
    chest: number;
    armR: number;
    armL: number;
    thigh: number;
    calf: number;
  };
  folds: {
    tricipital: number;
    bicipital: number;
    subscapular: number;
    suprailiac: number;
    abdominal: number;
    quadriceps: number;
  };
  notes: string;
}

export interface ClinicalHistory {
  background: {
    motive: string;
    medications: string;
    familyHistory: string;
    // New Pathological fields
    pathological?: {
      diabetes: boolean;
      cancer: boolean;
      dislipidemia: boolean;
      anemia: boolean;
      hypertension: boolean;
      renal: boolean;
      others: string;
      allergies: string;
    };
  };
  // New Gyneco fields
  gyneco?: {
    g: string;
    p: string;
    c: string;
    fum: string;
    contraception: string;
  };
  recall24h: {
    breakfast: string;
    snackAM: string;
    lunch: string;
    snackPM: string;
    dinner: string;
  };
  frequencies: Record<string, string>; // e.g., 'Verduras': 'Diario'
}

export interface Meal {
  id: string;
  name: string; // e.g., Option 1
  description: string;
}

export interface MealSection {
  title: string; // Desayuno, Almuerzo...
  options: Meal[];
}

export interface Plan {
  id: string;
  name: string;
  kcalTarget: number;
  active: boolean;
  sections: MealSection[];
  supplements: string;
  avoid: string;
  createdAt: string;
}

export interface Adherence {
  date: string; // YYYY-MM-DD
  completed: number; // Count of checked items
  total: number; // Total items tracked
  checks?: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    supplements: boolean;
  };
}

export interface LabResult {
  id: string;
  name: string;
  date: string;
  attachments?: string[]; // Array of image URLs
  markers: {
    name: string;
    value: string;
    unit?: string;
    flag?: 'high' | 'low' | 'normal';
  }[];
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string; // Date of birth
  gender: 'M' | 'F';
  occupation: string;
  
  // New Personal Data fields
  maritalStatus?: string;
  address?: string;

  avatarUrl?: string;
  notes: Note[];
  lifestyle: Lifestyle;
  anthropometry: Anthropometry[];
  clinical: ClinicalHistory;
  plans: Plan[];
  adherence: Adherence[];
  labs: LabResult[];
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  patients: Patient[];
}
