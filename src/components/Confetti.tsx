import { useEffect, useState } from "react";

// A subtle, dependency-free confetti burst shown once on a perfect round.
interface Piece {
  id: number;
  left: number;
  delay: number;
  rotate: number;
  color: string;
  duration: number;
}

const COLORS = ["#4f46e5", "#22a34a", "#e0a020", "#e06f6f", "#817cf6"];

export function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!active) return;
    setPieces(
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.25,
        rotate: Math.random() * 360,
        color: COLORS[i % COLORS.length],
        duration: 1.1 + Math.random() * 0.8,
      })),
    );
    const t = setTimeout(() => setPieces([]), 2400);
    return () => clearTimeout(t);
  }, [active]);

  if (!pieces.length) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            top: "-12px",
            left: `${p.left}%`,
            width: 8,
            height: 12,
            background: p.color,
            borderRadius: 2,
            transform: `rotate(${p.rotate}deg)`,
            animation: `gp-fall ${p.duration}s cubic-bezier(.3,.6,.5,1) ${p.delay}s forwards`,
          }}
        />
      ))}
      <style>{`@keyframes gp-fall{to{transform:translateY(105vh) rotate(720deg);opacity:.2}}`}</style>
    </div>
  );
}
