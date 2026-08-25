import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  INDIA_STATES,
  NATIONAL_AVG_AQI,
  getAqiColor,
  getAqiLevel,
  aqiToCigarettes,
} from './data/indiaAqi';
import { IndiaMap } from './components/IndiaMap';
import { StateDetail } from './components/StateDetail';
import { Activity, MapPin, Radio, AlertTriangle } from 'lucide-react';

function App() {
  const [selectedId, setSelectedId] = useState<string | null>('DL');
  const selected = useMemo(
    () => INDIA_STATES.find((s) => s.id === selectedId) ?? null,
    [selectedId]
  );

  const worst = useMemo(
    () => [...INDIA_STATES].sort((a, b) => b.aqi - a.aqi).slice(0, 5),
    []
  );

  const nationalCigs = aqiToCigarettes(NATIONAL_AVG_AQI);

  return (
    <div className="relative w-full h-screen overflow-hidden crt-flicker">
      <div className="crt-overlay" />
      <div className="crt-vignette" />

      <div className="relative z-10 h-full flex flex-col p-3 md:p-4 gap-3">
        <header className="hud-panel flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Radio size={16} className="glow-cyan animate-pulse" />
              <h1 className="text-sm md:text-base tracking-[0.2em] uppercase glow">
                Live AQI // India
              </h1>
            </div>
            <span className="hidden sm:inline text-[10px] opacity-40 tracking-widest">
              CPCB-style · sample data · historical 14d
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Activity size={12} className="opacity-60" />
              <span className="opacity-60">NAT AVG</span>
              <span
                className="font-bold"
                style={{ color: getAqiColor(NATIONAL_AVG_AQI) }}
              >
                {NATIONAL_AVG_AQI}
              </span>
              <span className="opacity-40">({getAqiLevel(NATIONAL_AVG_AQI)})</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5">
              <span className="opacity-60">≈</span>
              <span className="glow-amber font-bold">{nationalCigs.toFixed(1)}</span>
              <span className="opacity-50">cig/day</span>
            </div>
            <div className="text-[10px] opacity-40 tracking-wider">
              {new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              })}{' '}
              IST
            </div>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
          <aside className="lg:col-span-3 hud-panel rounded flex flex-col min-h-0 overflow-hidden">
            <div className="hud-panel-header px-3 py-2 flex items-center gap-2">
              <AlertTriangle size={12} />
              Top polluted
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {worst.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`w-full text-left px-2.5 py-2 rounded transition-colors flex items-center gap-2 ${
                    selectedId === s.id ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="text-[10px] opacity-40 w-4">#{i + 1}</span>
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: getAqiColor(s.aqi),
                      boxShadow: `0 0 6px ${getAqiColor(s.aqi)}`,
                    }}
                  />
                  <span className="flex-1 text-xs truncate">{s.name}</span>
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{ color: getAqiColor(s.aqi) }}
                  >
                    {s.aqi}
                  </span>
                </button>
              ))}
            </div>

            <div className="border-t border-white/10 p-3 text-[10px] opacity-50 space-y-1">
              <p className="flex items-center gap-1.5">
                <MapPin size={10} />
                {INDIA_STATES.length} states / UTs tracked
              </p>
              <p>
                Sample data for demo. Swap in OpenAQ / data.gov.in / WAQI when ready.
              </p>
            </div>
          </aside>

          <main className="lg:col-span-5 hud-panel rounded overflow-hidden flex flex-col min-h-[320px]">
            <div className="hud-panel-header px-3 py-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MapPin size={12} />
                Spatial view
              </span>
              <span className="text-[9px] opacity-40 tracking-widest">
                CLICK NODE · ANIMATED HIGHLIGHT
              </span>
            </div>
            <div className="flex-1 relative">
              <IndiaMap
                states={INDIA_STATES}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
          </main>

          <aside className="lg:col-span-4 hud-panel rounded p-3 min-h-0 overflow-hidden">
            <StateDetail state={selected} />
          </aside>
        </div>

        <footer className="text-[9px] opacity-30 tracking-widest text-center flex flex-wrap justify-center gap-x-4 gap-y-1">
          <span>INSPIRATION · HUD / CRT / BLADE RUNNER</span>
          <span>FONTS · DEPARTURE MONO / GEIST</span>
          <span>METRIC · CIGARETTE EQUIVALENT</span>
          <span>GITHUB · live-aqi-india</span>
        </footer>
      </div>

      <motion.div
        className="fixed top-2 left-2 w-8 h-8 border-l border-t border-[var(--crt-green)] opacity-30 pointer-events-none z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
      />
      <motion.div
        className="fixed top-2 right-2 w-8 h-8 border-r border-t border-[var(--crt-green)] opacity-30 pointer-events-none z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
      />
      <motion.div
        className="fixed bottom-2 left-2 w-8 h-8 border-l border-b border-[var(--crt-green)] opacity-30 pointer-events-none z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
      />
      <motion.div
        className="fixed bottom-2 right-2 w-8 h-8 border-r border-b border-[var(--crt-green)] opacity-30 pointer-events-none z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
      />
    </div>
  );
}

export default App;
