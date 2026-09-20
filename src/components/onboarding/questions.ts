export type QuestionKind = "single" | "multiple" | "number" | "text";

export type QuestionOption = {
  value: string;
  label: string;
};

export type OnboardingQuestion = {
  id:
    | "goal"
    | "experience_level"
    | "training_location"
    | "equipment"
    | "days_per_week"
    | "minutes_per_session"
    | "limitations"
    | "preference";
  title: string;
  description: string;
  kind: QuestionKind;
  required: boolean;
  options?: QuestionOption[];
};

export const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: "goal",
    title: "Was ist dein Trainingsziel?",
    description: "Wähle das Ziel, das für dich gerade am wichtigsten ist.",
    kind: "single",
    required: true,
    options: [
      { value: "muscle_gain", label: "Muskelaufbau" },
      { value: "fat_loss", label: "Fettabbau" },
      { value: "strength", label: "Kraft steigern" },
      { value: "endurance", label: "Ausdauer" },
      { value: "general_fitness", label: "Allgemein fitter werden" },
      { value: "mobility", label: "Beweglichkeit / Haltung" },
    ],
  },
  {
    id: "experience_level",
    title: "Wie viel Erfahrung hast du?",
    description: "Sei ehrlich – der Plan wird darauf abgestimmt.",
    kind: "single",
    required: true,
    options: [
      { value: "beginner", label: "Anfänger" },
      { value: "intermediate", label: "Fortgeschritten" },
      { value: "advanced", label: "Erfahren" },
    ],
  },
  {
    id: "training_location",
    title: "Wo möchtest du trainieren?",
    description: "Dein Trainingsort bestimmt, welche Übungen sinnvoll sind.",
    kind: "single",
    required: true,
    options: [
      { value: "gym", label: "Fitnessstudio" },
      { value: "home", label: "Zuhause" },
      { value: "outdoor", label: "Outdoor" },
      { value: "mixed", label: "Mix" },
    ],
  },
  {
    id: "equipment",
    title: "Welche Ausrüstung hast du?",
    description: "Du kannst mehrere Antworten auswählen.",
    kind: "multiple",
    required: true,
    options: [
      { value: "bodyweight", label: "Körpergewicht / keine Geräte" },
      { value: "dumbbells", label: "Kurzhanteln" },
      { value: "barbell", label: "Langhantel" },
      { value: "bands", label: "Widerstandsbänder" },
      { value: "pull_up_bar", label: "Klimmzugstange" },
      { value: "machines", label: "Maschinen" },
      { value: "kettlebell", label: "Kettlebell" },
      { value: "cardio_machines", label: "Cardio-Geräte" },
    ],
  },
  {
    id: "days_per_week",
    title: "An wie vielen Tagen pro Woche willst du trainieren?",
    description: "Wähle eine realistische Zahl, die du länger durchhalten kannst.",
    kind: "number",
    required: true,
    options: [
      { value: "2", label: "2 Tage" },
      { value: "3", label: "3 Tage" },
      { value: "4", label: "4 Tage" },
      { value: "5", label: "5 Tage" },
      { value: "6", label: "6 Tage" },
    ],
  },
  {
    id: "minutes_per_session",
    title: "Wie viel Zeit hast du pro Einheit?",
    description: "Gemeint ist die Trainingszeit ohne Anfahrt.",
    kind: "number",
    required: true,
    options: [
      { value: "20", label: "20 Minuten" },
      { value: "30", label: "30 Minuten" },
      { value: "45", label: "45 Minuten" },
      { value: "60", label: "60 Minuten" },
      { value: "90", label: "90 Minuten" },
    ],
  },
  {
    id: "limitations",
    title: "Gibt es Einschränkungen?",
    description:
      "Zum Beispiel Verletzungen, Schmerzen oder Übungen, die du vermeiden möchtest. Dieses Feld ist optional.",
    kind: "text",
    required: false,
  },
  {
    id: "preference",
    title: "Welche Trainingsart magst du am liebsten?",
    description: "So kann der Plan näher an deinem Geschmack bleiben.",
    kind: "single",
    required: true,
    options: [
      { value: "strength_training", label: "Krafttraining" },
      { value: "cardio", label: "Cardio" },
      { value: "mixed", label: "Mix" },
      { value: "calisthenics", label: "Calisthenics" },
      { value: "hiit", label: "HIIT / Functional" },
    ],
  },
];
