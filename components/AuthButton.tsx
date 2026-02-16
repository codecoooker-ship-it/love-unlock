"use client";

import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function AuthButton() {
  async function signIn() {
    const redirectTo = `${window.location.origin}/auth/callback`;
    await supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  }

  async function signOut() {
    await supabaseBrowser.auth.signOut();
    window.location.reload();
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={signIn}
        className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-semibold"
      >
        Sign in with Google
      </button>
      <button
        onClick={signOut}
        className="px-4 py-2 rounded-xl bg-white/70 border border-white/60 font-semibold"
      >
        Sign out
      </button>
    </div>
  );
}
