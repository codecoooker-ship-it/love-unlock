import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";

export function makeSlug() {
  return nanoid(7).toUpperCase();
}
export function makeEditSecret() {
  return nanoid(24);
}
export async function hashPin(pin: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pin, salt);
}
export async function verifyPin(pin: string, hash: string) {
  return bcrypt.compare(pin, hash);
}

export const PLAN_LIMITS = {
  FREE: { memories: 5, voice: false, hd: false },
  CRUSH49: { memories: 10, voice: false, hd: false },
  ROM99: { memories: 9999, voice: true, hd: false },
  ULT199: { memories: 9999, voice: true, hd: true },
} as const;

export type Plan = keyof typeof PLAN_LIMITS;

export function normalizePlan(p: any): Plan {
  if (p === "CRUSH49" || p === "ROM99" || p === "ULT199") return p;
  return "FREE";
}
