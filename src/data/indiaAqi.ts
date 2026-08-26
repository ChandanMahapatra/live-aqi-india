export type AqiLevel =
  | 'Good'
  | 'Satisfactory'
  | 'Moderate'
  | 'Poor'
  | 'Very Poor'
  | 'Severe';

export interface StateAqi {
  id: string;
  name: string;
  code: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  o3: number;
  co: number;
  dominant: string;
  lastUpdated: string;
  x: number;
  y: number;
  history: number[];
}

export function getAqiLevel(aqi: number): AqiLevel {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

export function getAqiColor(aqi: number): string {
  if (aqi <= 50) return '#00e676';
  if (aqi <= 100) return '#aeea00';
  if (aqi <= 200) return '#ffd600';
  if (aqi <= 300) return '#ff9100';
  if (aqi <= 400) return '#ff3d00';
  return '#d50000';
}

/** ~22 µg/m³ PM2.5 ≈ 1 cigarette/day for sustained 24-hour exposure. */
export function pm25ToCigarettes(pm25: number): number {
  return Math.max(0, Math.round((pm25 / 22) * 10) / 10);
}

function hist(base: number): number[] {
  return Array.from({ length: 14 }, (_, i) =>
    Math.max(20, Math.round(base + Math.sin(i * 0.7) * 15 + (i % 3) * 5 - 10))
  );
}

export const INDIA_STATES: StateAqi[] = [
  { id: 'DL', name: 'Delhi', code: 'DL', aqi: 312, pm25: 168, pm10: 245, no2: 42, so2: 12, o3: 28, co: 1.8, dominant: 'PM2.5', lastUpdated: '2026-08-25T10:30:00+05:30', x: 48, y: 28, history: hist(300) },
  { id: 'UP', name: 'Uttar Pradesh', code: 'UP', aqi: 278, pm25: 142, pm10: 210, no2: 38, so2: 15, o3: 32, co: 1.5, dominant: 'PM2.5', lastUpdated: '2026-08-25T10:15:00+05:30', x: 55, y: 35, history: hist(270) },
  { id: 'HR', name: 'Haryana', code: 'HR', aqi: 265, pm25: 135, pm10: 198, no2: 35, so2: 11, o3: 30, co: 1.4, dominant: 'PM2.5', lastUpdated: '2026-08-25T10:20:00+05:30', x: 45, y: 26, history: hist(255) },
  { id: 'PB', name: 'Punjab', code: 'PB', aqi: 198, pm25: 95, pm10: 160, no2: 28, so2: 9, o3: 35, co: 1.1, dominant: 'PM2.5', lastUpdated: '2026-08-25T09:45:00+05:30', x: 42, y: 20, history: hist(190) },
  { id: 'RJ', name: 'Rajasthan', code: 'RJ', aqi: 156, pm25: 72, pm10: 140, no2: 22, so2: 8, o3: 40, co: 0.9, dominant: 'PM10', lastUpdated: '2026-08-25T10:00:00+05:30', x: 35, y: 38, history: hist(150) },
  { id: 'MH', name: 'Maharashtra', code: 'MH', aqi: 112, pm25: 52, pm10: 95, no2: 30, so2: 14, o3: 45, co: 0.8, dominant: 'PM2.5', lastUpdated: '2026-08-25T10:10:00+05:30', x: 38, y: 58, history: hist(110) },
  { id: 'GJ', name: 'Gujarat', code: 'GJ', aqi: 98, pm25: 45, pm10: 88, no2: 25, so2: 18, o3: 38, co: 0.7, dominant: 'PM10', lastUpdated: '2026-08-25T09:50:00+05:30', x: 28, y: 48, history: hist(95) },
  { id: 'WB', name: 'West Bengal', code: 'WB', aqi: 187, pm25: 88, pm10: 155, no2: 32, so2: 16, o3: 29, co: 1.2, dominant: 'PM2.5', lastUpdated: '2026-08-25T10:05:00+05:30', x: 72, y: 48, history: hist(180) },
  { id: 'BR', name: 'Bihar', code: 'BR', aqi: 245, pm25: 125, pm10: 190, no2: 29, so2: 10, o3: 26, co: 1.3, dominant: 'PM2.5', lastUpdated: '2026-08-25T09:55:00+05:30', x: 68, y: 40, history: hist(240) },
  { id: 'KA', name: 'Karnataka', code: 'KA', aqi: 78, pm25: 35, pm10: 65, no2: 18, so2: 7, o3: 42, co: 0.5, dominant: 'O3', lastUpdated: '2026-08-25T10:25:00+05:30', x: 42, y: 72, history: hist(75) },
  { id: 'TN', name: 'Tamil Nadu', code: 'TN', aqi: 85, pm25: 38, pm10: 72, no2: 20, so2: 8, o3: 48, co: 0.6, dominant: 'O3', lastUpdated: '2026-08-25T10:00:00+05:30', x: 48, y: 82, history: hist(82) },
  { id: 'KL', name: 'Kerala', code: 'KL', aqi: 52, pm25: 22, pm10: 40, no2: 12, so2: 5, o3: 35, co: 0.4, dominant: 'PM2.5', lastUpdated: '2026-08-25T09:40:00+05:30', x: 38, y: 88, history: hist(50) },
  { id: 'AP', name: 'Andhra Pradesh', code: 'AP', aqi: 92, pm25: 42, pm10: 78, no2: 19, so2: 9, o3: 40, co: 0.6, dominant: 'PM2.5', lastUpdated: '2026-08-25T10:15:00+05:30', x: 52, y: 68, history: hist(90) },
  { id: 'TG', name: 'Telangana', code: 'TG', aqi: 105, pm25: 48, pm10: 85, no2: 24, so2: 11, o3: 36, co: 0.7, dominant: 'PM2.5', lastUpdated: '2026-08-25T10:05:00+05:30', x: 48, y: 62, history: hist(100) },
  { id: 'MP', name: 'Madhya Pradesh', code: 'MP', aqi: 134, pm25: 62, pm10: 115, no2: 21, so2: 10, o3: 33, co: 0.8, dominant: 'PM2.5', lastUpdated: '2026-08-25T09:50:00+05:30', x: 48, y: 48, history: hist(130) },
  { id: 'OR', name: 'Odisha', code: 'OR', aqi: 118, pm25: 55, pm10: 98, no2: 17, so2: 12, o3: 31, co: 0.7, dominant: 'PM2.5', lastUpdated: '2026-08-25T10:20:00+05:30', x: 65, y: 55, history: hist(115) },
  { id: 'AS', name: 'Assam', code: 'AS', aqi: 145, pm25: 68, pm10: 120, no2: 15, so2: 6, o3: 25, co: 0.9, dominant: 'PM2.5', lastUpdated: '2026-08-25T09:30:00+05:30', x: 82, y: 32, history: hist(140) },
  { id: 'JK', name: 'Jammu & Kashmir', code: 'JK', aqi: 68, pm25: 30, pm10: 55, no2: 10, so2: 4, o3: 28, co: 0.4, dominant: 'PM2.5', lastUpdated: '2026-08-25T09:20:00+05:30', x: 42, y: 10, history: hist(65) },
  { id: 'HP', name: 'Himachal Pradesh', code: 'HP', aqi: 55, pm25: 24, pm10: 42, no2: 8, so2: 3, o3: 32, co: 0.3, dominant: 'O3', lastUpdated: '2026-08-25T09:25:00+05:30', x: 45, y: 18, history: hist(52) },
  { id: 'UK', name: 'Uttarakhand', code: 'UK', aqi: 72, pm25: 32, pm10: 58, no2: 12, so2: 5, o3: 30, co: 0.5, dominant: 'PM2.5', lastUpdated: '2026-08-25T09:35:00+05:30', x: 50, y: 22, history: hist(70) },
];

/** Unweighted averages across the simulated regions; not official national figures. */
export const DEMO_AVG_AQI = Math.round(
  INDIA_STATES.reduce((sum, state) => sum + state.aqi, 0) / INDIA_STATES.length
);

export const DEMO_AVG_PM25 =
  INDIA_STATES.reduce((sum, state) => sum + state.pm25, 0) / INDIA_STATES.length;
