interface Props {
  h24: number;
  m: number;
  size?: number;
}

// A small, clean analog clock. Hour hand moves smoothly with the minutes so e.g.
// 3:30 shows the hour hand halfway between 3 and 4 — important for reading "halb".
export function ClockFace({ h24, m, size = 132 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  const minuteAngle = (m / 60) * 360;
  const hourAngle = (((h24 % 12) + m / 60) / 12) * 360;

  const hand = (angle: number, length: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + Math.cos(rad) * length, y: cy + Math.sin(rad) * length };
  };
  const minTip = hand(minuteAngle, r * 0.78);
  const hourTip = hand(hourAngle, r * 0.52);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`clock showing ${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`}
      className="mx-auto"
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        className="fill-surface stroke-border"
        strokeWidth={2}
      />
      {/* hour ticks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        const inner = i % 3 === 0 ? r * 0.78 : r * 0.86;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * r * 0.92}
            y1={cy + Math.sin(a) * r * 0.92}
            x2={cx + Math.cos(a) * inner}
            y2={cy + Math.sin(a) * inner}
            className="stroke-muted"
            strokeWidth={i % 3 === 0 ? 2.5 : 1.5}
            strokeLinecap="round"
          />
        );
      })}
      {/* hour hand */}
      <line
        x1={cx}
        y1={cy}
        x2={hourTip.x}
        y2={hourTip.y}
        className="stroke-text"
        strokeWidth={4}
        strokeLinecap="round"
      />
      {/* minute hand */}
      <line
        x1={cx}
        y1={cy}
        x2={minTip.x}
        y2={minTip.y}
        className="stroke-accent"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={3.5} className="fill-text" />
    </svg>
  );
}
