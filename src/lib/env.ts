export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};

/** Vrai quand les variables publiques Supabase sont renseignées. */
export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

/**
 * En mode démonstration (Supabase non configuré), l'administration peut être
 * prévisualisée hors production ou si ADMIN_DEMO_PREVIEW=true.
 */
export function isAdminDemoPreviewAllowed(): boolean {
  if (isSupabaseConfigured()) return false;
  return process.env.NODE_ENV !== "production" || process.env.ADMIN_DEMO_PREVIEW === "true";
}
