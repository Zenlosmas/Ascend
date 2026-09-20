import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { supabase } from "./lib/supabaseClient";
import { AuthPage } from "./pages/AuthPage";
import { HomePage } from "./pages/HomePage";
import { OnboardingPage } from "./pages/OnboardingPage";
import type { FitnessProfile } from "./types/fitnessProfile";

export default function App() {
  const { session, isLoading, signIn, signUp, signOut } = useAuth();
  const [profile, setProfile] = useState<FitnessProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    setIsProfileLoading(true);
    const { data } = await supabase
      .from("fitness_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    setProfile(data);
    setIsProfileLoading(false);
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }
    void loadProfile(session.user.id);
  }, [session, loadProfile]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-zinc-600">
        Laden…
      </main>
    );
  }

  if (!session) {
    return <AuthPage onSignIn={signIn} onSignUp={signUp} />;
  }

  if (isProfileLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-zinc-600">
        Laden…
      </main>
    );
  }

  if (!profile) {
    return (
      <OnboardingPage
        userId={session.user.id}
        onSaved={() => loadProfile(session.user.id)}
      />
    );
  }

  return <HomePage email={session.user.email} onSignOut={signOut} />;
}
