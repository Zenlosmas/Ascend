import type { OnboardingAnswers } from "../../types/fitnessProfile";
import type { OnboardingQuestion } from "./questions";

type QuestionStepProps = {
  question: OnboardingQuestion;
  answers: OnboardingAnswers;
  onChange: (nextAnswers: OnboardingAnswers) => void;
};

function optionButtonClass(isSelected: boolean) {
  if (isSelected) {
    return "w-full rounded-xl border-2 border-zinc-900 bg-zinc-900 px-4 py-3 text-left text-white";
  }
  return "w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-left text-zinc-900 hover:border-zinc-400";
}

export function QuestionStep({ question, answers, onChange }: QuestionStepProps) {
  function selectSingle(value: string) {
    onChange({ ...answers, [question.id]: value });
  }

  function selectNumber(value: string) {
    onChange({ ...answers, [question.id]: Number(value) });
  }

  function toggleEquipment(value: string) {
    const alreadySelected = answers.equipment.includes(value);
    const nextEquipment = alreadySelected
      ? answers.equipment.filter((item) => item !== value)
      : [...answers.equipment, value];
    onChange({ ...answers, equipment: nextEquipment });
  }

  if (question.kind === "text") {
    return (
      <label className="block">
        <span className="mb-2 block text-sm text-zinc-600">{question.description}</span>
        <textarea
          className="min-h-32 w-full rounded-xl border-2 border-zinc-200 bg-white p-3"
          value={answers.limitations}
          onChange={(event) =>
            onChange({ ...answers, limitations: event.target.value })
          }
          placeholder="Zum Beispiel: Knieprobleme, keine Klimmzüge, ..."
        />
      </label>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-zinc-600">{question.description}</p>
      <div className="flex flex-col gap-2">
        {question.options?.map((option) => {
          const isSelected =
            question.kind === "multiple"
              ? answers.equipment.includes(option.value)
              : question.kind === "number"
                ? String(answers[question.id]) === option.value
                : answers[question.id] === option.value;

          return (
            <button
              key={option.value}
              type="button"
              className={optionButtonClass(isSelected)}
              onClick={() => {
                if (question.kind === "multiple") {
                  toggleEquipment(option.value);
                } else if (question.kind === "number") {
                  selectNumber(option.value);
                } else {
                  selectSingle(option.value);
                }
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
