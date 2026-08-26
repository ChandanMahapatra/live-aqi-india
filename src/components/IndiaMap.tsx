import { motion } from 'framer-motion';
import { getAqiColor, getAqiLevel } from '../data/indiaAqi';
import type { StateAqi } from '../data/indiaAqi';

interface Props {
  states: StateAqi[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function IndiaMap({ states, selectedId, onSelect }: Props) {
  return (
    <div className="relative w-full h-full min-h-[420px] grid-bg rounded-sm overflow-hidden">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {states.map((s) => {
          const color = getAqiColor(s.aqi);
          const isSelected = selectedId === s.id;
          return (
            <g key={`glow-${s.id}`}>
              <circle
                cx={s.x}
                cy={s.y}
                r={isSelected ? 9 : 6}
                fill={color}
                opacity={0.12}
                style={{ filter: `blur(4px)` }}
              />
            </g>
          );
        })}

        {states.slice(0, 8).map((s, i) => {
          const next = states[(i + 3) % states.length];
          return (
            <line
              key={`link-${s.id}`}
              x1={s.x}
              y1={s.y}
              x2={next.x}
              y2={next.y}
              stroke="rgba(0,255,159,0.08)"
              strokeWidth="0.15"
            />
          );
        })}

        {states.map((s) => {
          const color = getAqiColor(s.aqi);
          const isSelected = selectedId === s.id;
          const level = getAqiLevel(s.aqi);

          return (
            <g
              key={s.id}
              className="cursor-pointer state-highlight"
              role="button"
              tabIndex={0}
              aria-label={`${s.name}: AQI ${s.aqi}, ${level}`}
              onClick={() => onSelect(s.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(s.id);
                }
              }}
              style={{ color }}
            >
              <motion.circle
                cx={s.x}
                cy={s.y}
                r={isSelected ? 4.2 : 2.8}
                fill="none"
                stroke={color}
                strokeWidth={isSelected ? 0.6 : 0.35}
                initial={false}
                animate={{
                  r: isSelected ? 4.2 : 2.8,
                  opacity: isSelected ? 1 : 0.7,
                }}
                style={{
                  filter: isSelected ? `drop-shadow(0 0 4px ${color})` : undefined,
                }}
              />
              <motion.circle
                cx={s.x}
                cy={s.y}
                r={isSelected ? 2.2 : 1.5}
                fill={color}
                animate={{ r: isSelected ? 2.2 : 1.5 }}
              />
              <text
                x={s.x}
                y={s.y - (isSelected ? 6 : 4.5)}
                textAnchor="middle"
                fill={color}
                fontSize={isSelected ? 3.2 : 2.4}
                fontFamily="inherit"
                opacity={isSelected ? 1 : 0.65}
                className="pointer-events-none select-none"
                style={{
                  textShadow: isSelected ? `0 0 3px ${color}` : undefined,
                }}
              >
                {s.code}
              </text>
              {isSelected && (
                <text
                  x={s.x}
                  y={s.y + 7}
                  textAnchor="middle"
                  fill={color}
                  fontSize="2.2"
                  opacity={0.9}
                  className="pointer-events-none"
                >
                  {level}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 text-[9px] tracking-wider opacity-70">
        {[
          { label: 'Good', color: '#00e676' },
          { label: 'Satis.', color: '#aeea00' },
          { label: 'Mod.', color: '#ffd600' },
          { label: 'Poor', color: '#ff9100' },
          { label: 'V.Poor', color: '#ff3d00' },
          { label: 'Severe', color: '#d50000' },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: l.color, boxShadow: `0 0 4px ${l.color}` }}
            />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
