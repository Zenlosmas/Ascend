import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const WEEKDAYS = [
  { value: 0, label: "Mo" },
  { value: 1, label: "Di" },
  { value: 2, label: "Mi" },
  { value: 3, label: "Do" },
  { value: 4, label: "Fr" },
  { value: 5, label: "Sa" },
  { value: 6, label: "So" },
];

export function TrainingSchedule() {
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("training_schedule")
        .select("weekday")
        .eq("user_id", user.id)
        .eq("domain", "fitness");

      if (data) {
        setSelected(data.map((d) => d.weekday));
      }
      setLoading(false);
    }

    void load();
  }, []);

  function toggleDay(day: number) {
    setSelected((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  async function save() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setSaving(true);

    await supabase
      .from("training_schedule")
      .delete()
      .eq("user_id", user.id)
      .eq("domain", "fitness");

    if (selected.length > 0) {
      await supabase.from("training_schedule").insert(
        selected.map((weekday) => ({
          user_id: user.id,
          domain: "fitness",
          weekday,
        }))
      );
    }

    setSaving(false);
  }

  if (loading) return null;

  return (
    <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Deine Trainingstage</h2>
      <div className="mb-4 flex gap-2">
        {WEEKDAYS.map((day) => (
          <button
            key={day.value}
            type="button"
            onClick={() => toggleDay(day.value)}
            className={`h-10 w-10 rounded-full text-sm font-medium transition ${
              selected.includes(day.value)
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          void save();
        }}
        disabled={saving}
        className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {saving ? "Speichert..." : "Speichern"}
      </button>
    </div>
  );
}