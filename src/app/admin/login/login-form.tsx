"use client";
import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { loginAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, {});
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      {state.error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{state.error}</p>}
      <label className="block">
        <span className="label">Adresse e-mail</span>
        <input name="email" type="email" autoComplete="username" required className="input" />
      </label>
      <label className="block">
        <span className="label">Mot de passe</span>
        <input name="password" type="password" autoComplete="current-password" required className="input" />
      </label>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />} Se connecter
      </Button>
    </form>
  );
}
