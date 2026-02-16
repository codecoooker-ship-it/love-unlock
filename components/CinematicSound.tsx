"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  ambientSrc?: string; // default: /audio/ambient.mp3
  yesSrc?: string;     // default: /audio/yes.mp3
  noSrc?: string;      // default: /audio/no.mp3
  ambientVolume?: number; // 0-1
};

function clamp(v: number, a = 0, b = 1) {
  return Math.max(a, Math.min(b, v));
}

export default function CinematicSound({
  ambientSrc = "/audio/ambient.mp3",
  yesSrc = "/audio/yes.mp3",
  noSrc = "/audio/no.mp3",
  ambientVolume = 0.18, // 🔉 default low
}: Props) {
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const yesRef = useRef<HTMLAudioElement | null>(null);
  const noRef = useRef<HTMLAudioElement | null>(null);

  const [unlocked, setUnlocked] = useState(false);
  const [muted, setMuted] = useState(false);

  // Expose simple global triggers: window.__LU_SOUND__.yes() / no()
  const api = useMemo(() => {
    return {
      yes: () => playOneShot(yesRef.current, 0.35),
      no: () => playOneShot(noRef.current, 0.22),
      mute: (m: boolean) => setMuted(m),
      isMuted: () => muted,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted]);

  function playOneShot(aud: HTMLAudioElement | null, vol: number) {
    if (!aud || muted) return;
    try {
      aud.pause();
      aud.currentTime = 0;
      aud.volume = clamp(vol);
      aud.play().catch(() => {});
    } catch {}
  }

  async function fadeTo(aud: HTMLAudioElement, target: number, ms = 700) {
    const start = aud.volume;
    const end = clamp(target);
    const steps = 18;
    const stepMs = Math.max(16, Math.floor(ms / steps));
    for (let i = 1; i <= steps; i++) {
      await new Promise((r) => setTimeout(r, stepMs));
      const t = i / steps;
      aud.volume = start + (end - start) * t;
    }
  }

  async function startAmbient() {
    const aud = ambientRef.current;
    if (!aud || muted) return;
    aud.loop = true;
    aud.volume = 0; // start silent then fade in
    try {
      await aud.play();
      await fadeTo(aud, clamp(ambientVolume), 900);
    } catch {
      // autoplay blocked until user gesture
    }
  }

  async function stopAmbient() {
    const aud = ambientRef.current;
    if (!aud) return;
    try {
      await fadeTo(aud, 0, 450);
      aud.pause();
    } catch {}
  }

  // 1) Load saved preference (optional)
  useEffect(() => {
    const m = localStorage.getItem("lu_muted");
    if (m === "1") setMuted(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("lu_muted", muted ? "1" : "0");
    // mute/unmute affects ambient immediately
    if (!ambientRef.current) return;
    if (muted) stopAmbient();
    else if (unlocked) startAmbient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted]);

  // 2) Unlock audio after first user interaction (required by browsers)
  useEffect(() => {
    function unlockOnce() {
      setUnlocked(true);
      // start ambient after unlock
      startAmbient();
      window.removeEventListener("pointerdown", unlockOnce);
      window.removeEventListener("keydown", unlockOnce);
    }
    window.addEventListener("pointerdown", unlockOnce, { once: true });
    window.addEventListener("keydown", unlockOnce, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlockOnce);
      window.removeEventListener("keydown", unlockOnce);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3) Pause/resume on tab visibility (nice + professional)
  useEffect(() => {
    const onVis = () => {
      if (!ambientRef.current) return;
      if (document.hidden) stopAmbient();
      else if (unlocked && !muted) startAmbient();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked, muted]);

  // 4) Put API on window so ProposalClient can trigger YES/NO sounds
  useEffect(() => {
    (window as any).__LU_SOUND__ = api;
    return () => {
      if ((window as any).__LU_SOUND__ === api) delete (window as any).__LU_SOUND__;
    };
  }, [api]);

  return (
    <>
      {/* audio tags */}
      <audio ref={ambientRef} src={ambientSrc} preload="auto" />
      <audio ref={yesRef} src={yesSrc} preload="auto" />
      <audio ref={noRef} src={noSrc} preload="auto" />

      {/* small unlock hint (only until first click) */}
      {!unlocked && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="px-4 py-2 rounded-2xl bg-black/70 text-white text-sm shadow backdrop-blur">
            Tap anywhere to enable sound 🎧
          </div>
        </div>
      )}

      {/* optional silent control button (hidden by default) */}
      {/* If you want NO control UI, keep it hidden. */}
      <button
        onClick={() => setMuted((m) => !m)}
        className="fixed top-4 right-4 z-50 px-3 py-2 rounded-xl bg-white/70 backdrop-blur border border-white/60 text-sm font-semibold text-neutral-900 shadow"
        style={{ display: "none" }} // change to "block" if you want a mute button
        aria-label="Mute sound"
      >
        {muted ? "Sound: OFF" : "Sound: ON"}
      </button>
    </>
  );
}
