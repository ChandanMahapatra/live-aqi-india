import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from 'recharts';
import { getAqiColor } from '../data/indiaAqi';

interface Props {
  history: number[];
  currentAqi: number;
}

export function HistoricalChart({ history, currentAqi }: Props) {
  const data = history.map((aqi, i) => ({
    day: `D-${history.length - 1 - i}`,
    aqi,
  }));

  const color = getAqiColor(currentAqi);

  return (
    <div className="h-36 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="aqiFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            tick={{ fill: 'rgba(0,255,159,0.5)', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 'auto']}
            tick={{ fill: 'rgba(0,255,159,0.5)', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#0a0e14',
              border: '1px solid rgba(0,255,159,0.3)',
              borderRadius: 4,
              fontSize: 11,
              fontFamily: 'inherit',
            }}
            labelStyle={{ color: 'rgba(0,255,159,0.7)' }}
            itemStyle={{ color }}
          />
          <ReferenceLine y={100} stroke="rgba(255,214,0,0.3)" strokeDasharray="3 3" />
          <ReferenceLine y={200} stroke="rgba(255,145,0,0.3)" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="aqi"
            stroke={color}
            strokeWidth={2}
            fill="url(#aqiFill)"
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
