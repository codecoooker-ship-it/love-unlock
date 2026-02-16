const POEMS = [
  { t: "Bangla • Romantic", d: "তোমার হাসি আমার সকাল, তোমার কথা আমার ভালোবাসা।" },
  { t: "Bangla • Propose", d: "শুধু আজ না, সারাজীবন তোমার পাশেই থাকতে চাই—Will you be mine?" },
  { t: "English • Cute", d: "If love had a name, it would sound like yours." },
  { t: "English • Deep", d: "I don’t need perfect. I need you." },
];

export default function Poems() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-rose-100 to-white px-6 py-14">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-semibold text-rose-900">Love Poems</h1>
        <p className="mt-2 text-rose-700">Copy & paste ready lines for your Love Unlock page 💖</p>

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {POEMS.map((p) => (
            <div key={p.t} className="p-6 rounded-2xl bg-white/70 backdrop-blur shadow">
              <p className="text-rose-900 font-semibold">{p.t}</p>
              <p className="mt-2 text-rose-700 whitespace-pre-wrap">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
