import { useState } from "react";
import { QuestionStep } from "../components/onboarding/QuestionStep";
import { onboardingQuestions } from "../components/onboarding/questions";
import { supabase } from "../lib/supabaseClient";
import {
  emptyOnboardingAnswers,
  type OnboardingAnswers,
} from "../types/fitnessProfile";

type OnboardingPageProps = {
  userId: string;
  onSaved: () => Promise<void>;
};

function isCurrentQuestionAnswered(
  answers: OnboardingAnswers,
  stepIndex: number,
) {
  const question = onboardingQuestions[stepIndex];

  if (question.id === "equipment") {
    return answers.equipment.length > 0;
  }
  if (question.id === "limitations") {
    return true;
  }
  if (question.id === "days_per_week" || question.id === "minutes_per_session") {
    return answers[question.id] !== null;
  }
  return answers[question.id] !== "";
}

export function OnboardingPage({ userId, onSaved }: OnboardingPageProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(emptyOnboardingAnswers);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const question = onboardingQuestions[stepIndex];
  const isLastStep = stepIndex === onboardingQuestions.length - 1;
  const canContinue = isCurrentQuestionAnswered(answers, stepIndex);

  async function saveProfile() {
    setErrorMessage("");
    setIsSaving(true);

    const { error } = await supabase.from("fitness_profiles").insert({
      user_id: userId,
      domain: "fitness",
      goal: answers.goal,
      experience_level: answers.experience_level,
      training_location: answers.training_location,
      equipment: answers.equipment,
      days_per_week: answers.days_per_week,
      minutes_per_session: answers.minutes_per_session,
      limitations: answers.limitations.trim() || null,
      preference: answers.preference,
    });

    setIsSaving(false);

    if (error) {
      setErrorMessage("Speichern hat nicht geklappt. Bitte noch einmal versuchen.");
      return;
    }

    await onSaved();
  }

  return (
    <main className="mx-auto min-h-screen max-w-lg px-4 py-10">
      <p className="mb-2 text-sm text-zinc-500">
        Frage {stepIndex + 1} von {onboardingQuestions.length}
      </p>
      <h1 className="mb-6 text-2xl font-semibold">{question.title}</h1>

      <QuestionStep
        question={question}
        answers={answers}
        onChange={setAnswers}
      />

      {errorMessage ? (
        <p className="mt-4 text-sm text-red-700">{errorMessage}</p>
      ) : null}

      <div className="mt-8 flex gap-3">
        {stepIndex > 0 ? (
          <button
            type="button"
            className="rounded-xl border-2 border-zinc-200 px-4 py-3"
            onClick={() => {
              setErrorMessage("");
              setStepIndex(stepIndex - 1);
            }}
          >
            Zurück
          </button>
        ) : null}

        {isLastStep ? (
          <button
            type="button"
            disabled={!canContinue || isSaving}
            className="flex-1 rounded-xl bg-zinc-900 py-3 font-medium text-white disabled:opacity-60"
            onClick={() => {
              void saveProfile();
            }}
          >
            {isSaving ? "Wird gespeichert…" : "Speichern"}
          </button>
        ) : (
          <button
            type="button"
            disabled={!canContinue}
            className="flex-1 rounded-xl bg-zinc-900 py-3 font-medium text-white disabled:opacity-60"
            onClick={() => setStepIndex(stepIndex + 1)}
          >
            Weiter
          </button>
        )}
      </div>
    </main>
  );
}
