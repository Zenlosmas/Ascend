import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { CuratedResources } from "../components/CuratedResources";
type HomePageProps = {
  email: string | undefined;
  onSignOut: () => Promise<void>;
};

type TrainingDay = {
  day: number;
  focus: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    notes?: string;
  }[];
};

type TrainingPlan = {
  days: TrainingDay[];
  general_notes: string;
};

export function HomePage({ email, onSignOut }: HomePageProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function generatePlan() {
    setErrorMessage("");
    setIsGenerating(true);

    const { data, error } = await supabase.functions.invoke(
      "generate-training-plan",
    );

    setIsGenerating(false);

    if (error) {
      setErrorMessage(
        "Plan konnte nicht erstellt werden. Bitte noch einmal versuchen.",
      );
      return;
    }

    if (data?.error) {
      setErrorMessage(data.error);
      return;
    }

    setPlan(data.plan.plan_data);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-10">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold">Onboarding abgeschlossen</h1>
        <p className="mb-6 text-zinc-600">
          Dein Fitness-Profil ist gespeichert
          {email ? ` (${email})` : ""}.
        </p>

        {!plan ? (
                          <button
                          type="button"
                          disabled={isGenerating}
                          onClick={() => {
                            void generatePlan();
                          }}
                          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 font-medium text-white disabled:opacity-60"
                        >
                          {isGenerating && (
                            <span
                              className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                              aria-hidden="true"
                            />
                          )}
                          {isGenerating ? "Plan wird erstellt…" : "Trainingsplan erstellen"}
                        </button>
        ) : null}

        {errorMessage ? (
          <p className="mb-4 text-sm text-red-700">{errorMessage}</p>
        ) : null}

        <button
          type="button"
          onClick={() => {
            void onSignOut();
          }}
          className="rounded-xl border-2 border-zinc-200 px-4 py-2"
        >
          Abmelden
        </button>
      </div>

      {plan ? (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Dein Trainingsplan</h2>
          <p className="mb-6 text-sm text-zinc-600">{plan.general_notes}</p>

          {plan.days.map((day) => (
            <div key={day.day} className="mb-6">
              <h3 className="mb-2 font-medium">
                Tag {day.day}: {day.focus}
              </h3>
              <ul className="space-y-1 text-sm text-zinc-700">
                {day.exercises.map((exercise, i) => (
                  <li key={i}>
                    {exercise.name} — {exercise.sets}x{exercise.reps}
                    {exercise.notes ? ` (${exercise.notes})` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
       ) : null}

       <CuratedResources />
     </main>
   );
 }