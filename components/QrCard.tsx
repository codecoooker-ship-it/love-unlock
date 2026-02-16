"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import * as htmlToImage from "html-to-image";

export default function QrCard({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);

  async function downloadQR() {
    if (!ref.current) return;

    const dataUrl = await htmlToImage.toPng(ref.current, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "white",
    });

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "love-unlock-qr.png";
    a.click();
  }

  return (
    <div className="mt-6 rounded-2xl bg-white/70 backdrop-blur shadow p-5 text-center">
      <p className="text-rose-900 font-semibold">Scan QR 💘</p>

      {/* ✅ ref wraps QR for download */}
      <div
        ref={ref}
        className="mt-3 inline-block bg-white p-4 rounded-xl border border-rose-100"
      >
        <QRCodeCanvas value={url} size={180} />
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <button
          onClick={downloadQR}
          className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-semibold"
        >
          Download QR
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(url);
            alert("Link copied ✅");
          }}
          className="px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-800 font-semibold"
        >
          Copy Link
        </button>
      </div>

      <p className="mt-3 text-xs text-rose-600">
        QR scan করলে সরাসরি love page open হবে ✅
      </p>
    </div>
  );
}
