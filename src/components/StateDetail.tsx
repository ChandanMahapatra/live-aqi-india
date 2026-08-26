import { motion, AnimatePresence } from 'framer-motion';
import { getAqiLevel, getAqiColor } from '../data/indiaAqi';
import type { StateAqi } from '../data/indiaAqi';
import { AqiGauge } from './AqiGauge';
import { CigaretteBar } from './CigaretteBar';
import { HistoricalChart } from './HistoricalChart';
import { formatTime } from '../utils/format';
import { Wind, Droplets, CloudFog } from 'lucide-react';

interface Props {
  state: StateAqi | null;
}

export function StateDetail({ state }: Props) {
  return (
    <AnimatePresence mode="wait">
      {state ? (
        <motion.div
          key={state.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="lg:h-full flex flex-col gap-4 overflow-visible lg:overflow-y-auto pr-1"
        >
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl tracking-wide glow">{state.name}</h2>
              <span
                className="text-xs px-2 py-0.5 border rounded"
                style={{
                  borderColor: getAqiColor(state.aqi),
                  color: getAqiColor(state.aqi),
                }}
              >
                {getAqiLevel(state.aqi)}
              </span>
            </div>
            <p className="text-[10px] opacity-50 mt-1">
              Simulated snapshot {formatTime(state.lastUpdated)} · Dominant: {state.dominant}
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <AqiGauge aqi={state.aqi} size={120} />
            <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              {[
                { label: 'PM2.5', value: state.pm25, unit: 'µg/m³' },
                { label: 'PM10', value: state.pm10, unit: 'µg/m³' },
                { label: 'NO₂', value: state.no2, unit: 'µg/m³' },
                { label: 'SO₂', value: state.so2, unit: 'µg/m³' },
                { label: 'O₃', value: state.o3, unit: 'µg/m³' },
                { label: 'CO', value: state.co, unit: 'mg/m³' },
              ].map((p) => (
                <div key={p.label} className="flex justify-between border-b border-white/5 pb-0.5">
                  <span className="opacity-60">{p.label}</span>
                  <span>
                    {p.value} <span className="opacity-40 text-[9px]">{p.unit}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="hud-panel p-3 rounded">
            <CigaretteBar pm25={state.pm25} />
          </div>

          <div className="hud-panel p-3 rounded flex-1 min-h-[160px]">
            <div className="hud-panel-header pb-2 mb-2 flex items-center gap-2">
              <CloudFog size={12} />
              14-day AQI trend
            </div>
            <HistoricalChart history={state.history} currentAqi={state.aqi} />
          </div>

          {state.aqi > 200 && (
            <div className="text-[10px] opacity-60 flex gap-2 items-start border border-red-500/30 bg-red-500/5 p-2 rounded">
              <Wind size={14} className="text-red-400 shrink-0 mt-0.5" />
              <span>
                High pollution — sensitive groups should limit outdoor activity.
                {state.aqi > 300 && ' Consider masks & indoor filtration.'}
              </span>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-full flex flex-col items-center justify-center text-center opacity-50 gap-3"
        >
          <Droplets size={32} className="opacity-40" />
          <p className="text-sm tracking-widest uppercase">Select a state</p>
          <p className="text-xs max-w-[200px]">
            Select any node to inspect simulated AQI, pollutants and history.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
