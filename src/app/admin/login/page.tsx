"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";

const initialState: SignInState = { error: null };

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        action={formAction}
        className="border-border-strong bg-surface-2 w-full max-w-sm space-y-5 rounded-2xl border p-8"
      >
        <div>
          <h1 className="text-foreground text-xl font-semibold">Administration HEXA</h1>
          <p className="text-foreground/60 mt-1 text-sm">
            Connexion réservée à l&apos;équipe.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-foreground text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className="border-border-strong bg-background text-foreground focus-visible:outline-accent w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:outline-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-foreground text-sm font-medium">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="border-border-strong bg-background text-foreground focus-visible:outline-accent w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:outline-2"
          />
        </div>

        {state.error && (
          <p role="alert" className="text-sm text-red-400">
            {state.error}
          </p>
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Connexion…" : "Se connecter"}
        </Button>
      </form>
    </main>
  );
}
