import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Resource = {
  id: string;
  title: string;
  url: string;
  type: string;
  level: string;
  location: string;
  focus: string;
  description: string;
};

export function CuratedResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("fitness_profiles")
        .select("experience_level, training_location")
        .eq("user_id", user.id)
        .single();

      if (!profile) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("curated_resources")
        .select("*")
        .eq("domain", "fitness");

      if (error || !data) {
        setLoading(false);
        return;
      }

      const scored = (data as Resource[]).map((r) => {
        let score = 0;
        if (r.level === profile.experience_level || r.level === "alle") score++;
        if (r.location === profile.training_location || r.location === "beides") score++;
        return { ...r, score };
      });

      const sorted = scored.filter((r) => r.score > 0).sort((a, b) => b.score - a.score);

      setResources(sorted);
      setLoading(false);
    }

    void load();
  }, []);

  if (loading) return null;
  if (resources.length === 0) return null;

  return (
    <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Kuratierte Ressourcen für dich</h2>
      <div className="space-y-3">
        {resources.map((r) => (
          <a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-zinc-200 p-4 transition hover:bg-zinc-50"
          >
            <p className="text-xs uppercase text-zinc-400">{r.type}</p>
            <p className="font-medium">{r.title}</p>
            <p className="text-sm text-zinc-600">{r.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}