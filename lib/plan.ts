export type Plan = "FREE" | "ROM99" | "ULT199";

export function normalizePlan(p: string): Plan {
  const x = String(p || "FREE").toUpperCase();
  if (x === "ULT199") return "ULT199";
  if (x === "ROM99") return "ROM99";
  return "FREE";
}

export function has(plan: Plan, feature: string) {
  if (plan === "ULT199") return true;

  const rom99 = new Set([
    "templates",
    "quiz",
    "calc",
    "game",
    "share",
  ]);

  if (plan === "ROM99") return rom99.has(feature);

  // FREE
  return feature === "proposal";
}

export function isAdminSlug(slug: string) {
  const adminSlug = process.env.ADMIN_SLUG || "ADMIN612";
  return String(slug || "").toUpperCase() === adminSlug.toUpperCase();
}

