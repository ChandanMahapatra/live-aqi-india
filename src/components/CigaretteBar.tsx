import { motion } from 'framer-motion';
import { aqiToCigarettes } from '../data/indiaAqi';

interface Props {
  aqi: number;
  maxCigs?: number;
}

export function CigaretteBar({ aqi, maxCigs = 20 }: Props) {
  const cigs = aqiToCigarettes(aqi);
  const filled = Math.min(cigs, maxCigs);
  const full = Math.floor(filled);
  const partial = filled - full;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xs tracking-widest uppercase opacity-70">
          Cigarette equivalent
        </span>
        <span className="glow text-lg font-bold">
          {cigs.toFixed(1)}{' '}
          <span className="text-xs opacity-70 font-normal">cig/day</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 items-end min-h-[28px]">
        {Array.from({ length: Math.ceil(Math.min(filled, maxCigs)) }).map((_, i) => {
          const isPartial = i === full && partial > 0;
          const height = isPartial ? 12 + partial * 12 : 24;
          return (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 300 }}
              className="relative origin-bottom"
              style={{ width: 10, height }}
            >
              <div
                className="absolute inset-0 rounded-sm"
                style={{
                  background: isPartial
                    ? `linear-gradient(to top, #f5e6c8 ${partial * 100}%, transparent 0%)`
                    : 'linear-gradient(to top, #f5e6c8 70%, #e8d4a8 70%, #e8d4a8 100%)',
                  boxShadow: '0 0 4px rgba(255, 180, 0, 0.4)',
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b-sm"
                style={{ background: '#c45c26' }}
              />
              {i < full && (
                <>
                  <div
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                    style={{
                      background: '#ff6b00',
                      boxShadow: '0 0 6px #ff6b00, 0 0 12px #ff3b00',
                    }}
                  />
                  <div
                    className="smoke-puff absolute -top-3 left-1/2 w-2 h-2 rounded-full bg-white/30"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="text-[10px] opacity-50 leading-relaxed">
        Heuristic: ~22 µg/m³ PM2.5 ≈ 1 cigarette/day (public health rule-of-thumb).
        Not a medical claim — for intuition only.
      </p>
    </div>
  );
}
