import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function weekdayOf(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return (d.getDay() + 6) % 7; // 0 = Montag
}

export function HabitTracker() {
  const [scheduledDays, setScheduledDays] = useState<number[]>([]);
  const [checkins, setCheckins] = useState<{ date: string; completed: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: schedule } = await supabase
      .from("training_schedule")
      .select("weekday")
      .eq("user_id", user.id)
      .eq("domain", "fitness");

    const { data: history } = await supabase
      .from("habit_checkins")
      .select("date, completed")
      .eq("user_id", user.id)
      .eq("domain", "fitness")
      .order("date", { ascending: false })
      .limit(60);

    setScheduledDays((schedule ?? []).map((s) => s.weekday));
    setCheckins(history ?? []);
    setLoading(false);
  }

  async function checkInToday() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setCheckingIn(true);

    await supabase.from("habit_checkins").upsert(
      {
        user_id: user.id,
        domain: "fitness",
        date: todayISO(),
        completed: true,
      },
      { onConflict: "user_id,domain,date" }
    );

    await load();
    setCheckingIn(false);
  }

  function calculateStreak(): number {
    if (scheduledDays.length === 0) return 0;

    const checkinDates = new Set(checkins.filter((c) => c.completed).map((c) => c.date));
    let streak = 0;
    let missedInRow = 0;
    const cursor = new Date();

    for (let i = 0; i < 90; i++) {
      const dateStr = cursor.toISOString().slice(0, 10);
      const weekday = weekdayOf(dateStr);

      if (scheduledDays.includes(weekday)) {
        if (checkinDates.has(dateStr)) {
          streak++;
          missedInRow = 0;
        } else {
          missedInRow++;
          if (missedInRow >= 2) break;
        }
      }

      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  }

  if (loading) return null;

  const alreadyCheckedInToday = checkins.some(
    (c) => c.date === todayISO() && c.completed
  );
  const streak = calculateStreak();
  const todayIsScheduled = scheduledDays.includes(weekdayOf(todayISO()));

  return (
    <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold">Dein Streak</h2>
      <p className="mb-4 text-3xl font-bold">{streak} {streak === 1 ? "Tag" : "Tage"}</p>

      {todayIsScheduled ? (
        <button
          type="button"
          onClick={() => {
            void checkInToday();
          }}
          disabled={checkingIn || alreadyCheckedInToday}
          className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {alreadyCheckedInToday
            ? "Heute erledigt"
            : checkingIn
              ? "Speichert..."
              : "Heute trainiert"}
        </button>
      ) : (
        <p className="text-sm text-zinc-500">Heute ist kein geplanter Trainingstag.</p>
      )}
    </div>
  );
}