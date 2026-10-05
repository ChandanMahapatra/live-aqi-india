export const CITIES = [
  { id: 'delhi', name: 'Delhi', lat: 28.6139, lon: 77.2090, state: 'IN-DL' },
  { id: 'mumbai', name: 'Mumbai', lat: 19.0760, lon: 72.8777, state: 'IN-MH' },
  { id: 'bengaluru', name: 'Bengaluru', lat: 12.9716, lon: 77.5946, state: 'IN-KA' },
  { id: 'kolkata', name: 'Kolkata', lat: 22.5726, lon: 88.3639, state: 'IN-WB' },
  { id: 'chennai', name: 'Chennai', lat: 13.0827, lon: 80.2707, state: 'IN-TN' },
  { id: 'hyderabad', name: 'Hyderabad', lat: 17.3850, lon: 78.4867, state: 'IN-TG' },
  { id: 'ahmedabad', name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, state: 'IN-GJ' },
  { id: 'jaipur', name: 'Jaipur', lat: 26.9124, lon: 75.7873, state: 'IN-RJ' },
  { id: 'lucknow', name: 'Lucknow', lat: 26.8467, lon: 80.9462, state: 'IN-UP' },
  { id: 'kanpur', name: 'Kanpur', lat: 26.4499, lon: 80.3319, state: 'IN-UP' },
  { id: 'nagpur', name: 'Nagpur', lat: 21.1458, lon: 79.0882, state: 'IN-MH' },
  { id: 'bhopal', name: 'Bhopal', lat: 23.2599, lon: 77.4126, state: 'IN-MP' },
  { id: 'patna', name: 'Patna', lat: 25.5941, lon: 85.1376, state: 'IN-BR' },
  { id: 'indore', name: 'Indore', lat: 22.7196, lon: 75.8577, state: 'IN-MP' },
  { id: 'pune', name: 'Pune', lat: 18.5204, lon: 73.8567, state: 'IN-MH' },
  { id: 'surat', name: 'Surat', lat: 21.1702, lon: 72.8311, state: 'IN-GJ' },
  { id: 'visakhapatnam', name: 'Visakhapatnam', lat: 17.6868, lon: 83.2185, state: 'IN-AP' },
  { id: 'vadodara', name: 'Vadodara', lat: 22.3072, lon: 73.1812, state: 'IN-GJ' },
  { id: 'ludhiana', name: 'Ludhiana', lat: 30.9010, lon: 75.8573, state: 'IN-PB' },
  { id: 'agra', name: 'Agra', lat: 27.1767, lon: 78.0081, state: 'IN-UP' },
  { id: 'bhubaneswar', name: 'Bhubaneswar', lat: 20.2961, lon: 85.8245, state: 'IN-OR' },
  { id: 'guwahati', name: 'Guwahati', lat: 26.1445, lon: 91.7362, state: 'IN-AS' },
  { id: 'dispur', name: 'Dispur', lat: 26.1433, lon: 91.7898, state: 'IN-AS' },
  { id: 'amaravati', name: 'Amaravati', lat: 16.5131, lon: 80.5165, state: 'IN-AP' },
  { id: 'itanagar', name: 'Itanagar', lat: 27.0844, lon: 93.6053, state: 'IN-AR' },
  { id: 'raipur', name: 'Raipur', lat: 21.2514, lon: 81.6296, state: 'IN-CT' },
  { id: 'panaji', name: 'Panaji', lat: 15.4909, lon: 73.8278, state: 'IN-GA' },
  { id: 'chandigarh', name: 'Chandigarh', lat: 30.7333, lon: 76.7794, state: 'IN-CH' },
  { id: 'shimla', name: 'Shimla', lat: 31.1048, lon: 77.1734, state: 'IN-HP' },
  { id: 'ranchi', name: 'Ranchi', lat: 23.3441, lon: 85.3096, state: 'IN-JH' },
  { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366, state: 'IN-KL' },
  { id: 'imphal', name: 'Imphal', lat: 24.817, lon: 93.9368, state: 'IN-MN' },
  { id: 'shillong', name: 'Shillong', lat: 25.5788, lon: 91.8933, state: 'IN-ML' },
  { id: 'aizawl', name: 'Aizawl', lat: 23.7271, lon: 92.7176, state: 'IN-MZ' },
  { id: 'kohima', name: 'Kohima', lat: 25.6751, lon: 94.1086, state: 'IN-NL' },
  { id: 'gangtok', name: 'Gangtok', lat: 27.3389, lon: 88.6065, state: 'IN-SK' },
  { id: 'agartala', name: 'Agartala', lat: 23.8315, lon: 91.2868, state: 'IN-TR' },
  { id: 'dehradun', name: 'Dehradun', lat: 30.3165, lon: 78.0322, state: 'IN-UT' },
  { id: 'srinagar', name: 'Srinagar', lat: 34.0837, lon: 74.7973, state: 'IN-JK' },
  { id: 'jammu', name: 'Jammu', lat: 32.7266, lon: 74.857, state: 'IN-JK' },
  { id: 'leh', name: 'Leh', lat: 34.1526, lon: 77.5771, state: 'IN-LA' },
  { id: 'puducherry', name: 'Puducherry', lat: 11.9416, lon: 79.8083, state: 'IN-PY' },
  { id: 'gurugram', name: 'Gurugram', lat: 28.4595, lon: 77.0266, state: 'IN-HR' },
  { id: 'faridabad', name: 'Faridabad', lat: 28.4089, lon: 77.3178, state: 'IN-HR' },
];

const API = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const POLLUTANTS = 'us_aqi,pm2_5,pm10,nitrogen_dioxide,sulphur_dioxide,ozone,carbon_monoxide';

export function buildSummaryURL(cities = CITIES) {
  const url = new URL(API);
  url.searchParams.set('latitude', cities.map(city => city.lat).join(','));
  url.searchParams.set('longitude', cities.map(city => city.lon).join(','));
  url.searchParams.set('current', 'us_aqi,pm2_5');
  url.searchParams.set('timeformat', 'unixtime');
  url.searchParams.set('domains', 'cams_global');
  return url.toString();
}

export function buildDetailURL(city) {
  const url = new URL(API);
  url.searchParams.set('latitude', String(city.lat));
  url.searchParams.set('longitude', String(city.lon));
  url.searchParams.set('current', POLLUTANTS);
  url.searchParams.set('hourly', 'us_aqi,pm2_5');
  url.searchParams.set('past_days', '30');
  url.searchParams.set('forecast_days', '1');
  url.searchParams.set('timezone', 'Asia/Kolkata');
  url.searchParams.set('timeformat', 'unixtime');
  url.searchParams.set('domains', 'cams_global');
  return url.toString();
}

export async function requestAir(url, signal) {
  let response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Could not reach Open-Meteo. Check your connection and try again.');
  }
  if (!response.ok) {
    if (response.status === 429) throw new Error('Open-Meteo is rate limiting requests. Try again shortly.');
    throw new Error(`Open-Meteo returned HTTP ${response.status}. Try again shortly.`);
  }
  const data = await response.json();
  if (data.error) throw new Error(data.reason || 'Open-Meteo could not return this location.');
  return data;
}

export function isReading(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

export function aqiCategory(value) {
  if (!isReading(value)) return { label: 'Unavailable', tone: 'unknown' };
  if (value <= 50) return { label: 'Good', tone: 'good' };
  if (value <= 100) return { label: 'Moderate', tone: 'moderate' };
  if (value <= 150) return { label: 'Unhealthy for sensitive groups', tone: 'sensitive' };
  if (value <= 200) return { label: 'Unhealthy', tone: 'unhealthy' };
  if (value <= 300) return { label: 'Very unhealthy', tone: 'very-unhealthy' };
  return { label: 'Hazardous', tone: 'hazardous' };
}

export function cigarettesPerDay(hourly, currentTime) {
  if (!hourly || !isReading(currentTime)) return null;
  const times = hourly.time;
  const values = hourly.pm2_5;
  if (!Array.isArray(times) || !Array.isArray(values) || times.length !== values.length) return null;
  const completed = times.map((time, index) => ({ time, value: values[index] }))
    .filter(point => isReading(point.time) && point.time + 3600 <= currentTime)
    .slice(-24);
  const anchor = times.find(isReading);
  const latestCompletedBoundary = anchor + Math.floor((currentTime - anchor) / 3600) * 3600;
  if (completed.length !== 24 || completed[23].time + 3600 !== latestCompletedBoundary) return null;
  if (completed.some((point, index) => !isReading(point.value) || (index > 0 && point.time - completed[index - 1].time !== 3600))) return null;
  const mean = completed.reduce((sum, point) => sum + point.value, 0) / 24;
  return { mean, estimate: mean / 22, start: completed[0].time, end: completed[23].time + 3600 };
}

export function historyForRange(hourly, currentTime, range) {
  if (!hourly || !isReading(currentTime) || !Array.isArray(hourly.time) || !Array.isArray(hourly.us_aqi)) return [];
  const duration = range === '24H' ? 24 : range === '7D' ? 24 * 7 : 24 * 30;
  const cutoff = currentTime - duration * 3600;
  return hourly.time.map((time, index) => ({ time, value: hourly.us_aqi[index] }))
    .filter(point => isReading(point.time) && point.time >= cutoff && point.time <= currentTime);
}

export function formatIST(seconds, options = {}) {
  if (!isReading(seconds)) return 'Time unavailable';
  return new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', ...options }).format(new Date(seconds * 1000));
}
