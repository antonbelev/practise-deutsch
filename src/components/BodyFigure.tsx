import { BODY_PARTS } from "../topics/bodyParts";

interface Props {
  size?: number;
  // when true, draw numbered markers + a legend for every anchored part
  labelled?: boolean;
}

// A clean, front-facing human figure in a 0–100 × 0–100 viewBox. Used as the
// illustrative header for the Body-parts topic. Numbered markers key into a
// legend so learners can see where each German word maps on the body.
export function BodyFigure({ size = 200, labelled = true }: Props) {
  const anchored = BODY_PARTS.filter((p) => p.anchor);

  return (
    <div className="flex items-start gap-4">
      <svg
        width={size}
        height={size * 1.6}
        viewBox="0 0 100 160"
        role="img"
        aria-label="Human figure with labelled body parts"
        className="shrink-0"
      >
        <g
          fill="rgb(var(--surface-2))"
          stroke="rgb(var(--border))"
          strokeWidth="1.2"
          strokeLinejoin="round"
        >
          {/* head */}
          <circle cx="50" cy="13" r="9" />
          {/* neck */}
          <rect x="46" y="21" width="8" height="6" rx="2" />
          {/* torso */}
          <path d="M35 28 Q50 25 65 28 L63 70 Q50 74 37 70 Z" />
          {/* left arm */}
          <path d="M35 30 L26 33 L21 62 L26 63 L31 40 Z" />
          {/* right arm */}
          <path d="M65 30 L74 33 L79 62 L74 63 L69 40 Z" />
          {/* left leg */}
          <path d="M40 70 L38 120 L36 150 L44 150 L47 120 L49 72 Z" />
          {/* right leg */}
          <path d="M60 70 L62 120 L64 150 L56 150 L53 120 L51 72 Z" />
        </g>

        {/* eyes / mouth for a friendly face */}
        <g fill="rgb(var(--muted))">
          <circle cx="46.5" cy="12" r="1.1" />
          <circle cx="53.5" cy="12" r="1.1" />
        </g>
        <path d="M46 16 Q50 18 54 16" fill="none" stroke="rgb(var(--muted))" strokeWidth="1" strokeLinecap="round" />

        {labelled &&
          anchored.map((p, i) => {
            // map the 0–100 anchor y into the 0–160 viewBox
            const cx = p.anchor!.x;
            const cy = (p.anchor!.y / 100) * 160;
            return (
              <g key={p.singular}>
                <circle cx={cx} cy={cy} r="4" fill="rgb(var(--accent))" opacity="0.95" />
                <text
                  x={cx}
                  y={cy + 2.6}
                  textAnchor="middle"
                  fontSize="5"
                  fontWeight="700"
                  fill="#fff"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
      </svg>

      {labelled && (
        <ol className="grid grid-cols-1 gap-x-4 gap-y-0.5 text-sm sm:grid-cols-2">
          {anchored.map((p, i) => (
            <li key={p.singular} className="flex items-baseline gap-1.5">
              <span className="w-4 shrink-0 text-right text-xs font-semibold text-accent">
                {i + 1}
              </span>
              <span>
                <span className="font-medium">
                  {p.article} {p.singular}
                </span>
                <span className="text-muted"> · the {p.en}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
