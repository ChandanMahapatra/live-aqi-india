import { getAqiColor, getAqiLevel } from '../data/indiaAqi';

interface Props {
  aqi: number;
  size?: number;
}

export function AqiGauge({ aqi, size = 140 }: Props) {
  const level = getAqiLevel(aqi);
  const color = getAqiColor(aqi);
  const pct = Math.min(aqi / 500, 1);
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference * pct;

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,255,159,0.12)"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circumference}`}
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
            transition: 'stroke-dasharray 0.8s ease',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold glow" style={{ color }}>
          {aqi}
        </span>
        <span className="text-[10px] tracking-widest uppercase opacity-70 mt-0.5">
          {level}
        </span>
      </div>
    </div>
  );
}
