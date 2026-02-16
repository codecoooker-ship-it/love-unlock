"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";

export default function ProposalClient({ page }: { page: any }) {
  const revealAt = page.reveal_at ? new Date(page.reveal_at).getTime() : null;
  const [now, setNow] = useState(Date.now());
  const locked = useMemo(() => (revealAt ? now < revealAt : false), [revealAt, now]);

  const [showYesModal, setShowYesModal] = useState(false);
  const [showNoModal, setShowNoModal] = useState(false);

  // AUDIO
  const ambientRef = useRef<HTMLAudioElement>(null);
  const yesRef = useRef<HTMLAudioElement>(null);
  const noRef = useRef<HTMLAudioElement>(null);
  const heartbeatRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // default volumes
  useEffect(() => {
    if (ambientRef.current) {
      ambientRef.current.volume = 0;
      ambientRef.current.loop = true;
    }
    if (yesRef.current) yesRef.current.volume = 0.25;
    if (noRef.current) noRef.current.volume = 0.2;

    if (heartbeatRef.current) {
      heartbeatRef.current.volume = 0.12;
      heartbeatRef.current.loop = true;
    }
  }, []);

  async function fade(audio: HTMLAudioElement, target: number, ms = 800) {
    const start = audio.volume;
    const steps = 20;
    for (let i = 1; i <= steps; i++) {
      await new Promise((r) => setTimeout(r, ms / steps));
      audio.volume = start + (target - start) * (i / steps);
    }
  }

  async function startAmbient() {
    try {
      await ambientRef.current?.play();
      if (ambientRef.current) await fade(ambientRef.current, 0.14, 900);
    } catch {}
  }

  async function duckAmbient(ms = 1200) {
    const a = ambientRef.current;
    if (!a) return;

    const prev = a.volume;
    await fade(a, 0.04, 200);
    await new Promise((r) => setTimeout(r, ms));
    await fade(a, prev, 600);
  }

  function stopAllOneShots() {
    // stop YES
    if (yesRef.current) {
      yesRef.current.pause();
      yesRef.current.currentTime = 0;
    }
    // stop NO
    if (noRef.current) {
      noRef.current.pause();
      noRef.current.currentTime = 0;
    }
    // stop heartbeat
    if (heartbeatRef.current) {
      heartbeatRef.current.pause();
      heartbeatRef.current.currentTime = 0;
    }
  }

  function fireConfetti() {
    confetti({ particleCount: 180, spread: 90, origin: { y: 0.65 } });

    setTimeout(() => {
      confetti({ particleCount: 90, spread: 120, origin: { x: 0.15, y: 0.65 } });
      confetti({ particleCount: 90, spread: 120, origin: { x: 0.85, y: 0.65 } });
    }, 200);
  }

  // ✅ save partner choice (YES/NO) to DB
  async function sendChoice(choice: "YES" | "NO") {
    try {
      await fetch("/api/page/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: page?.slug, choice }),
      });
    } catch {}
  }

  async function onYes() {
    sendChoice("YES"); // ✅ log

    stopAllOneShots();
    setShowNoModal(false);
    setShowYesModal(true);

    fireConfetti();

    try {
      if (yesRef.current) {
        yesRef.current.currentTime = 0;
        await yesRef.current.play();
      }
    } catch {}

    await duckAmbient(1400);

    try {
      await heartbeatRef.current?.play();
    } catch {}

    setTimeout(() => {
      heartbeatRef.current?.pause();
    }, 4000);
  }

  async function onNo() {
    sendChoice("NO"); // ✅ log

    stopAllOneShots();
    setShowYesModal(false);
    setShowNoModal(true);

    try {
      if (noRef.current) {
        noRef.current.currentTime = 0;
        await noRef.current.play();
      }
    } catch {}

    await duckAmbient(1200);
  }

  // ✅ auto-start ambient after first user interaction (browser policy)
  useEffect(() => {
    const unlock = () => {
      startAmbient();
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };

    window.addEventListener("click", unlock);
    window.addEventListener("touchstart", unlock);

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-pink-100 to-white flex items-center justify-center px-4">
      {/* AUDIO */}
      <audio ref={ambientRef} src="/ambient.mp3" preload="auto" />
      <audio ref={yesRef} src="/yes.mp3" preload="auto" />
      <audio ref={noRef} src="/no.mp3" preload="auto" />
      <audio ref={heartbeatRef} src="/heartbeat.mp3" preload="auto" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8 text-center"
      >
        <h1 className="text-4xl font-bold text-rose-900">{page.display_name}</h1>

        <p className="mt-3 text-rose-700 text-lg">{page.subtitle ?? "A private message 💌"}</p>

        {locked ? (
          <div className="mt-8 rounded-2xl bg-white/70 border border-white/60 p-5 shadow">
            <p className="text-rose-900 font-bold">Surprise will unlock soon 💝</p>
            <p className="mt-2 text-rose-700 text-sm">
              Unlock time: {page.reveal_at ? new Date(page.reveal_at).toLocaleString() : ""}
            </p>
          </div>
        ) : (
          <div className="mt-8">
            <p className="text-lg text-rose-900 leading-relaxed whitespace-pre-wrap">{page.message}</p>

            <div className="mt-8 flex gap-3">
              {/* YES BUTTON */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onYes}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold shadow-lg"
              >
                YES 💍
              </motion.button>

              {/* NO BUTTON */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onNo}
                className="flex-1 py-3 rounded-xl bg-black text-white font-semibold shadow-lg"
              >
                NO 🖤
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* YES MODAL */}
      <AnimatePresence>
        {showYesModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowYesModal(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-full max-w-sm bg-white rounded-3xl p-8 text-center shadow-2xl"
            >
              <div className="text-5xl">💖</div>
              <h2 className="mt-4 text-2xl font-bold text-rose-900">Thank You</h2>
              <p className="mt-2 text-rose-700">You made my day ✨</p>

              <button
                onClick={() => setShowYesModal(false)}
                className="mt-6 w-full px-6 py-2.5 bg-rose-600 text-white rounded-xl font-semibold"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NO MODAL */}
      <AnimatePresence>
        {showNoModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNoModal(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-full max-w-sm bg-white rounded-3xl p-8 text-center shadow-2xl"
            >
              <div className="text-5xl">💔</div>
              <h2 className="mt-4 text-2xl font-bold text-black">It&apos;s okay</h2>
              <p className="mt-2 text-gray-700">Thank you for breaking my heart</p>

              <button
                onClick={() => setShowNoModal(false)}
                className="mt-6 w-full px-6 py-2.5 bg-black text-white rounded-xl font-semibold"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
