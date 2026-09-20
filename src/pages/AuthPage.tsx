import { useState, type FormEvent } from "react";
import type { AuthError } from "@supabase/supabase-js";

type AuthPageProps = {
  onSignIn: (email: string, password: string) => Promise<AuthError | null>;
  onSignUp: (email: string, password: string) => Promise<AuthError | null>;
};

function germanAuthMessage(error: AuthError) {
  if (error.message.includes("Invalid login credentials")) {
    return "E-Mail oder Passwort stimmt nicht.";
  }
  if (error.message.includes("User already registered")) {
    return "Für diese E-Mail gibt es schon ein Konto. Bitte einloggen.";
  }
  if (error.message.includes("Password should be at least")) {
    return "Das Passwort muss mindestens 6 Zeichen haben.";
  }
  if (error.message.includes("Unable to validate email")) {
    return "Bitte gib eine gültige E-Mail-Adresse ein.";
  }
  return error.message;
}

export function AuthPage({ onSignIn, onSignUp }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage("");
    setInfoMessage("");
    setIsSubmitting(true);

    const error =
      mode === "login"
        ? await onSignIn(email, password)
        : await onSignUp(email, password);

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(germanAuthMessage(error));
      return;
    }

    if (mode === "signup") {
      setInfoMessage(
        "Konto angelegt. Wenn eine Bestätigungsmail kommt, bitte zuerst den Link darin öffnen, danach einloggen.",
      );
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="mb-1 text-3xl font-semibold">Ascend</h1>
      <p className="mb-8 text-zinc-600">Fitness, Personal Mode</p>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-xl font-medium">
          {mode === "login" ? "Einloggen" : "Konto erstellen"}
        </h2>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-zinc-600">E-Mail</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border-2 border-zinc-200 px-3 py-2"
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm text-zinc-600">Passwort</span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border-2 border-zinc-200 px-3 py-2"
          />
        </label>

        {errorMessage ? (
          <p className="mb-3 text-sm text-red-700">{errorMessage}</p>
        ) : null}
        {infoMessage ? (
          <p className="mb-3 text-sm text-green-800">{infoMessage}</p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-zinc-900 py-3 font-medium text-white disabled:opacity-60"
        >
          {isSubmitting
            ? "Bitte warten…"
            : mode === "login"
              ? "Einloggen"
              : "Registrieren"}
        </button>

        <button
          type="button"
          className="mt-4 w-full text-sm text-zinc-600 underline"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setErrorMessage("");
            setInfoMessage("");
          }}
        >
          {mode === "login"
            ? "Noch kein Konto? Hier registrieren"
            : "Schon ein Konto? Hier einloggen"}
        </button>
      </form>
    </main>
  );
}
