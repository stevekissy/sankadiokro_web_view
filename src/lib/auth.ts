import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";
import { createSupabaseAdminClient } from "./supabase/admin";
import { isAdminDemoPreviewAllowed, isSupabaseConfigured } from "./env";
import { mapProfile } from "./mappers";
import type { Profile, Role } from "./types";

export const DEMO_PROFILE: Profile = {
  id: "demo-admin",
  email: "demo@sankadiokro.local",
  fullName: "Aperçu démonstration",
  role: "admin",
};

/** Profil courant (null si non connecté). En mode démo hors production : profil fictif. */
export async function getCurrentProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured()) {
    return isAdminDemoPreviewAllowed() ? DEMO_PROFILE : null;
  }
  const sb = await createSupabaseServerClient();
  if (!sb) return null;
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!data) {
    // Premier utilisateur : aucun profil → pas de rôle, accès refusé.
    return null;
  }
  return mapProfile({ ...data, email: data.email ?? user.email });
}

/** Garantit un utilisateur connecté avec le rôle requis, sinon redirige. */
export async function requireProfile(minRole: Role = "manager"): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/admin/login");
  if (minRole === "admin" && profile.role !== "admin") redirect("/admin?error=forbidden");
  return profile;
}

/** Variante pour les server actions : lève une erreur au lieu de rediriger. */
export async function assertProfile(minRole: Role = "manager"): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) throw new Error("Non authentifié.");
  if (minRole === "admin" && profile.role !== "admin") throw new Error("Droits insuffisants.");
  return profile;
}

export async function logAction(
  profile: Profile,
  action: string,
  entity: string,
  entityId: string | null,
  details?: Record<string, unknown>,
) {
  const admin = createSupabaseAdminClient();
  if (!admin) return;
  await admin.from("audit_logs").insert({
    actor_id: profile.id === DEMO_PROFILE.id ? null : profile.id,
    actor_email: profile.email,
    action,
    entity,
    entity_id: entityId,
    details: details ?? null,
  });
}
