import { useEffect, useMemo, useRef, useState } from 'react';
import mapData from './india-map.json';
import { CITIES, aqiCategory, buildDetailURL, buildSummaryURL, cigarettesPerDay, formatIST, historyForRange, isReading, requestAir } from './air-data';
import './styles.css';

const detailCache = new Map();
const TTL = 15 * 60 * 1000;
const CITY_SIGNATURE = CITIES.map(city=>city.id).join(',');
const project = city => ({ x: (city.lon - 67) / 31.5 * 800, y: (38 - city.lat) / 32 * 720 });
const display = (number, digits = 0) => isReading(number) ? number.toFixed(digits) : '—';
const heatColor = (value, metric) => {
  if (!isReading(value)) return '#6d6145';
  const t = Math.min(1, value / (metric === 'pm2_5' ? 100 : 300));
  return `hsl(${56 - 56*t} 100% 55%)`;
};

function CityMap({ selected, onSelect, summary, metric, onMetric }) {
  const [ncrOpen,setNcrOpen] = useState(false);
  const ncrTrigger = useRef(null), firstNcrChoice = useRef(null);
  const ncrCities = CITIES.filter(city=>['delhi','gurugram','faridabad'].includes(city.id));
  const ncrPoint = project(ncrCities[0]);
  const isNcr = ncrCities.some(city=>city.id===selected.id);
  useEffect(()=>{if(ncrOpen)firstNcrChoice.current?.focus();},[ncrOpen]);
  useEffect(()=>{if(selected.id!=='delhi')setNcrOpen(selected.id==='gurugram'||selected.id==='faridabad');},[selected.id]);
  const closeNcr = () => {setNcrOpen(false);onSelect('delhi');ncrTrigger.current?.focus();};
  const chosen = project(selected);
  const labelWidth = Math.max(72, selected.name.length * 8 + 16);
  const labelX = Math.min(chosen.x + 17, 795 - labelWidth);
  const selectNearest = event => {
    const svg = event.currentTarget.ownerSVGElement;
    const point = new DOMPoint(event.clientX,event.clientY).matrixTransform(svg.getScreenCTM().inverse());
    const nearest = CITIES.filter(city=>!ncrCities.includes(city)).reduce((best,city)=>{
      const p=project(city),distance=Math.hypot(p.x-point.x,p.y-point.y);
      return distance<best.distance?{city,distance}:best;
    },{city:selected,distance:Infinity});
    onSelect(nearest.city.id);
  };
  const regional = new Map();
  CITIES.forEach((city,index) => {
    const value=summary?.[city.id]?.current?.[metric];
    if (isReading(value)) regional.set(city.state,[...(regional.get(city.state)||[]),value]);
  });
  const regionMean = id => { const values=regional.get(id); return values?.length ? values.reduce((a,b)=>a+b,0)/values.length : undefined; };
  return <section className="map-panel" aria-label="Map of Indian cities">
    <div className="map-legend"><label>Region color <select aria-label="Map pollutant" value={metric} onChange={event=>onMetric(event.target.value)}><option value="us_aqi">AQI</option><option value="pm2_5">PM2.5</option></select></label><span className="heat-scale"/><span>{metric==='us_aqi'?'0 → 300+ AQI':'0 → 100+ µg/m³'}</span><small>Listed-city mean, not state-wide · gray = no data</small></div>
    <svg className="india-map" viewBox="-12 -14 824 748" role="group" aria-label={'Dot map of India with ' + selected.name + ' selected'}>
      <g className="geo-grid" aria-hidden="true">
        {[68,72,76,80,84,88,92,96].map(lon => { const p=project({lon,lat:38}); return <g key={lon}><line x1={p.x} x2={p.x} y1="22" y2="710"/><text x={p.x} y="12" textAnchor="middle">{lon}°E</text></g>; })}
        {[36,32,28,24,20,16,12,8].map(lat => {const p=project({lon:67,lat});return <g key={lat}><line x1="27" x2="800" y1={p.y} y2={p.y}/><text x="0" y={p.y+3}>{lat}°N</text></g>;})}
      </g>
      <g className="state-outlines">{mapData.states.map(state => <path key={state.id} d={state.outline} />)}</g>
      <g className="map-dots">{mapData.states.map(state => <path key={state.id} d={state.dots} style={{fill:heatColor(regionMean(state.id),metric)}} className={state.id === selected.state ? 'state-active' : ''}><title>{state.name}: {display(regionMean(state.id),1)} {metric==='us_aqi'?'AQI':'µg/m³ PM2.5'} · listed-city mean</title></path>)}</g>
      <g className="country-labels" aria-hidden="true">{[['PAKISTAN',69.8,30.8],['CHINA',91.4,33.8],['NEPAL',84.5,28.3],['BHUTAN',90.4,27.5],['BANGLADESH',90.4,23.6],['MYANMAR',96,21.2],['ARABIAN SEA',69.8,15.5],['INDIAN OCEAN',84,7.3]].map(([name,lon,lat])=>{const p=project({lon,lat});return <text key={name} x={p.x} y={p.y} textAnchor="middle">{name}</text>;})}</g>
      <g className="city-markers">{CITIES.filter(city=>!ncrCities.includes(city)).map(city=>{const p=project(city);return <g key={city.id} role="button" tabIndex="0" aria-label={'Select '+city.name} aria-pressed={selected.id===city.id} className="city-map-target" onClick={selectNearest} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onSelect(city.id);}}}><title>{city.name}</title><circle className="city-hit" cx={p.x} cy={p.y} r="8"/><circle cx={p.x} cy={p.y} r="3.8"/></g>;})}</g>
      <g className="map-selected-label" aria-hidden="true">
        {!isNcr && <><circle className="selection-frame" cx={chosen.x} cy={chosen.y} r="11"/>
        <circle className="selected-dot" cx={chosen.x} cy={chosen.y} r="5"/></>}
        <rect className="label-back" x={labelX} y={chosen.y-13} width={labelWidth} height="26"/>
        <text x={labelX+8} y={chosen.y+4}>{selected.name.toUpperCase()}</text>
      </g>
      <g ref={ncrTrigger} role="button" tabIndex="0" className="city-map-target ncr-marker" aria-label="Choose Delhi NCR city" aria-expanded={ncrOpen} aria-controls="ncr-chooser" onClick={()=>{if(ncrOpen)closeNcr();else setNcrOpen(true);}} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();if(ncrOpen)closeNcr();else setNcrOpen(true);}}}>
        <title>Delhi NCR: Delhi, Gurugram, Faridabad</title>
        {isNcr && <circle className="selection-frame" cx={ncrPoint.x} cy={ncrPoint.y} r="12"/>}
        <circle cx={ncrPoint.x} cy={ncrPoint.y} r="8"/>
        <text x={ncrPoint.x} y={ncrPoint.y+3} textAnchor="middle">3</text>
      </g>
    </svg>
    {ncrOpen && <div id="ncr-chooser" className="map-chooser" role="group" aria-label="Delhi NCR cities" onKeyDown={event=>{if(event.key==='Escape'){event.stopPropagation();closeNcr();}}}><div className="chooser-heading"><span>Delhi NCR · nearby cities</span><button className="chooser-close" type="button" aria-label="Close Delhi NCR chooser" onClick={closeNcr}>×</button></div>{ncrCities.map((city,index)=><button ref={index===0?firstNcrChoice:null} key={city.id} type="button" aria-pressed={city.id===selected.id} className={city.id===selected.id?'selected-choice':''} onClick={()=>{onSelect(city.id);setNcrOpen(true);}}>{city.name}</button>)}</div>}

  </section>;
}


export function CigaretteArt({ amount }) {
  const count = amount == null ? 3 : Math.min(6, Math.max(1, Math.ceil(amount)));
  return <div className="cigarette-art" aria-hidden="true">
    <div className="cigarette-stack">{Array.from({length:count},(_,index)=>{
      const fraction = amount == null ? 0 : Math.min(1,Math.max(0,amount-index));
      const top = 100 - 80 * fraction;
      const filterHeight = Math.min(16,80*fraction);
      return <svg key={index} className="cigarette-icon" viewBox="0 0 32 120" shapeRendering="crispEdges" data-fraction={fraction.toFixed(3)}>
        {fraction>0 && <>
          <rect x="9" y={top} width="14" height={80*fraction} fill="#e7e3d9"/>
          <rect x="9" y={top} width="5" height={80*fraction} fill="#c9c9bd"/>
          <rect x="9" y={100-filterHeight} width="14" height={filterHeight} fill="#ffb342"/>
          <rect x="9" y={100-filterHeight} width="5" height={filterHeight} fill="#e28d28"/>
          <rect x="9" y={top} width="14" height={Math.min(6,80*fraction)} fill="#f16b36"/>
          <rect x="9" y={top} width="5" height={Math.min(6,80*fraction)} fill="#cd482a"/>
          <g transform={'translate(0 '+(top-20)+')'} className="smoke-origin">
            <g className="pixel-smoke smoke-a" style={{animationDelay:(index*-.4)+'s'}}><path d="M11 17h4v-5h4V7h-4V2h-4" fill="none" stroke="#ddcfb2" strokeWidth="3"/></g>
            <g className="pixel-smoke smoke-b" style={{animationDelay:(index*-.4-1.2)+'s'}}><path d="M21 17h3v-5h-3V7h-3V2h3" fill="none" stroke="#c4b58f" strokeWidth="3"/></g>
          </g>
        </>}
        {!fraction && <path d="M10 100h12" stroke="#9c743c" strokeWidth="2"/>}
      </svg>;
    })}</div>
    {amount>6 && <span className="cigarette-overflow">+{(amount-6).toFixed(1)} more</span>}
  </div>;
}

function MethodDialog({ onClose, cigarette, returnFocusRef }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => { dialog.close(); returnFocusRef.current?.focus(); };
  }, []);
  const trapTab = event => {
    if (event.key !== 'Tab') return;
    const elements = [...dialogRef.current.querySelectorAll('button,a[href]')];
    const first = elements[0], last = elements.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  return <dialog ref={dialogRef} className="method-dialog" aria-labelledby="method-title" onCancel={onClose} onKeyDown={trapTab}>
    <button className="dialog-close" type="button" aria-label="Close method" onClick={onClose} autoFocus>×</button>
    <h2 id="method-title">Data & method</h2>
    <p>We average the last 24 completed hourly PM2.5 model values for the selected city, then divide by 22 µg/m³. Berkeley Earth uses that concentration as a rough daily exposure equivalent to one cigarette.</p>
    <p>This is a population-level illustration of long-term air-pollution exposure. It is not an estimate of cigarettes smoked, personal dose, or individual health risk. We require a complete, current 24-hour window.</p>
    {cigarette && <p className="method-window">Window: {formatIST(cigarette.start, {day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',hour12:false})} – {formatIST(cigarette.end, {day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',hour12:false})} IST.</p>}
    <a href="https://berkeleyearth.org/air-pollution-and-cigarette-equivalence/" target="_blank" rel="noreferrer">Read Berkeley Earth’s method ↗</a>
    <hr/><p className="source-note">Air data: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> / <a href="https://atmosphere.copernicus.eu/" target="_blank" rel="noreferrer">Copernicus CAMS</a>, approximately 45 km model resolution for India. US AQI scale; this is not official CPCB station AQI.</p>
    <p className="source-note">Regional color is the mean of available listed-city values within each state, not an area-weighted state estimate. Unavailable regions are muted. City dots show every listed location; choose a city from the sidebar.</p><p className="source-note">Map: <a href="https://www.geoboundaries.org/" target="_blank" rel="noreferrer">geoBoundaries</a> / DataMeet / Election Commission of India, CC BY 2.5 IN. Boundaries follow that dataset.</p>
  </dialog>;
}

function HistoryChart({ hourly, currentTime, range, cityName }) {
  const points = useMemo(() => historyForRange(hourly, currentTime, range), [hourly, currentTime, range]);
  const [focus, setFocus] = useState(null);
  const [pointer, setPointer] = useState(null);
  const svgRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(1000);
  useEffect(() => {
    if (!svgRef.current) return;
    const observer = new ResizeObserver(([entry]) => setChartWidth(Math.max(260, Math.round(entry.contentRect.width))));
    observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, [points.length]);
  useEffect(() => { setFocus(null); setPointer(null); }, [range, cityName]);
  if (!points.length) return <div className="chart-empty">No modeled history is available for this period.</div>;
  const left = 36, right = chartWidth - 15, top = 14, bottom = 112;
  const ceiling = Math.max(100, Math.ceil(Math.max(...points.filter(p => isReading(p.value)).map(p => p.value), 0) / 50) * 50);
  const x = index => left + (points[index].time - points[0].time) / Math.max(points.at(-1).time - points[0].time, 1) * (right - left);
  const y = reading => bottom - reading / ceiling * (bottom - top);
  const segments = []; let active = [];
  points.forEach((p, i) => { if (isReading(p.value)) { if (active.length && p.time - points[active.at(-1)[0]].time > 3600) { segments.push(active); active = []; } active.push([i, p.value]); } else if (active.length) { segments.push(active); active = []; } });
  if (active.length) segments.push(active);
  const chosenIndex = Math.min(points.length - 1, Math.max(0, focus ?? points.length - 1));
  const nearestValid = (start, direction) => { for (let i = start; i >= 0 && i < points.length; i += direction) if (isReading(points[i].value)) return i; return null; };
  const validIndex = isReading(points[chosenIndex].value) ? chosenIndex : nearestValid(chosenIndex, -1) ?? nearestValid(chosenIndex, 1);
  const chosen = validIndex == null ? null : points[validIndex];
  const setByPointer = event => {
    const rect = svgRef.current.getBoundingClientRect();
    const plotX = Math.min(right,Math.max(left,(event.clientX-rect.left)/rect.width*chartWidth));
    const time = points[0].time + (plotX-left)/(right-left)*(points.at(-1).time-points[0].time);
    let index=0;for(let i=1;i<points.length;i++)if(Math.abs(points[i].time-time)<Math.abs(points[index].time-time))index=i;
    setFocus(index);
    setPointer({left:Math.min(rect.width-152,Math.max(8,event.clientX-rect.left+12)),top:Math.max(3,Math.min(rect.height-36,event.clientY-rect.top-38))});
  };
  const ticks = [0, .25, .5, .75, 1].map(frac => Math.round(frac * (points.length - 1)));
  return <div className="chart-wrap">
    <div className={"chart-readout "+(pointer?"pointer-readout":"")} style={pointer||undefined} aria-live="polite"><strong>{chosen ? formatIST(chosen.time, range === '24H' ? { hour: '2-digit', minute: '2-digit', hour12: false } : { day: '2-digit', month: 'short', hour: '2-digit', hour12: false }) : 'No reading'}</strong><span>{chosen ? 'AQI ' + display(chosen.value) : 'AQI —'}</span></div>
    <svg ref={svgRef} className="history-svg" viewBox={'0 0 ' + chartWidth + ' 160'} preserveAspectRatio="none" role="img" tabIndex="0" aria-label={cityName + ' AQI history. Use left and right arrow keys to inspect hourly readings.'} onPointerMove={setByPointer} onPointerDown={setByPointer} onPointerLeave={()=>setPointer(null)} onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); setPointer(null); setFocus(Math.min(points.length - 1, Math.max(0, chosenIndex + (event.key === 'ArrowLeft' ? -1 : 1)))); } }}>
      <defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ff9d35" stopOpacity=".35"/><stop offset="1" stopColor="#ff9d35" stopOpacity=".02"/></linearGradient></defs>
      {[0, .25, .5, .75, 1].map(frac => <g key={frac} className="chart-gridline"><line x1={left} x2={right} y1={bottom - frac * (bottom - top)} y2={bottom - frac * (bottom - top)} /><text x="2" y={bottom - frac * (bottom - top) + 4}>{Math.round(frac * ceiling)}</text></g>)}
      {ticks.map((tick, i) => <g key={i} className="chart-tick"><line x1={x(tick)} x2={x(tick)} y1={top} y2={bottom}/><text x={x(tick)} y="150" textAnchor={i === 0 ? 'start' : i === 4 ? 'end' : 'middle'}>{range === '24H' ? formatIST(points[tick].time, { hour: '2-digit', minute: '2-digit', hour12: false }) : formatIST(points[tick].time, { day: '2-digit', month: 'short' })}</text></g>)}
      {segments.map((segment, i) => { const line = segment.map(([idx, val], j) => (j ? 'L' : 'M') + x(idx).toFixed(2) + ' ' + y(val).toFixed(2)).join(''); const area = line + 'L' + x(segment.at(-1)[0]) + ' ' + bottom + 'L' + x(segment[0][0]) + ' ' + bottom + 'Z'; return <g key={i}><path className="chart-area" d={area}/><path className="chart-line" d={line}/></g>; })}
      {chosen && <g><line className="chart-cursor" x1={x(validIndex)} x2={x(validIndex)} y1={top} y2={bottom}/><circle className="chart-point" cx={x(validIndex)} cy={y(chosen.value)} r="5"/></g>}
    </svg>
  </div>;
}

export default function App() {
  const [selectedId, setSelectedId] = useState('delhi');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [metric, setMetric] = useState('us_aqi');
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState('');
  const [range, setRange] = useState('24H');
  const [fetchTime, setFetchTime] = useState(null);
  const [methodOpen, setMethodOpen] = useState(false);
  const [smokeOn,setSmokeOn] = useState(true);
  const methodTriggerRef = useRef(null);
  const [revision, setRevision] = useState(0);
  const selected = CITIES.find(city => city.id === selectedId) || CITIES[0];
  const matching = CITIES.filter(city => city.name.toLowerCase().includes(search.trim().toLowerCase())).sort((a,b)=>{
    if(sort==='name')return a.name.localeCompare(b.name);
    const av=summary?.[a.id]?.current?.[sort], bv=summary?.[b.id]?.current?.[sort];
    return (isReading(bv)?bv:-1)-(isReading(av)?av:-1)||a.name.localeCompare(b.name);
  });

  useEffect(() => {
    const controller = new AbortController();
    setSummaryError('');
    requestAir(buildSummaryURL(), controller.signal).then(data => {
      if (!Array.isArray(data) || data.length !== CITIES.length) throw new Error('City readings were incomplete.');
      if (!controller.signal.aborted) setSummary(Object.fromEntries(CITIES.map((city,index)=>[city.id,data[index]])));
    }).catch(error => { if (error.name !== 'AbortError') setSummaryError(error.message); });
    return () => controller.abort();
  }, [revision, CITY_SIGNATURE]);

  useEffect(() => {
    const controller = new AbortController();
    setDetail(null); setDetailError(''); setFetchTime(null);
    const cached = detailCache.get(selected.id);
    if (cached && Date.now() - cached.saved < TTL) { setDetail(cached.data); setFetchTime(cached.saved); return () => controller.abort(); }
    requestAir(buildDetailURL(selected), controller.signal).then(data => {
      if (!data.current || !data.hourly) throw new Error('Detailed readings were incomplete.');
      if (controller.signal.aborted) return;
      const saved = Date.now(); detailCache.set(selected.id, { data, saved }); setDetail(data); setFetchTime(saved);
    }).catch(error => { if (error.name !== 'AbortError') setDetailError(error.message); });
    return () => controller.abort();
  }, [selected.id, revision]);

  const current = detail?.current;
  const selectedSummary = summary?.[selected.id]?.current;
  const aqi = current?.us_aqi ?? selectedSummary?.us_aqi;
  const category = aqiCategory(aqi);
  const cigarette = cigarettesPerDay(detail?.hourly, current?.time);
  const openMethod = event => { methodTriggerRef.current=event.currentTarget; setMethodOpen(true); };
  const refresh = () => { detailCache.clear(); setRevision(number => number + 1); };

  return <div className={"app-shell "+(!smokeOn?"smoke-paused":"")}><a className="skip-link" href="#main-content">Skip to air quality</a>
    <header className="site-header">
      <div className="brand">Air Quality in India</div>
      <div className="header-date"><strong>{formatIST(Date.now()/1000,{day:'2-digit',month:'short',year:'numeric'}).toUpperCase()}</strong><small>{formatIST(Date.now()/1000,{weekday:'long'}).toUpperCase()} · IST</small></div>
    </header>
    <main id="main-content">
      <div className="atlas-grid">
        <aside className="city-panel" aria-label="Indian city readings">
          <label className="search-box"><img className="search-symbol" src={import.meta.env.BASE_URL + "icons/search.svg"} alt="" /><span className="sr-only">Search city</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search city..." autoComplete="off" /></label>
          <label className="sort-control">Sort <select aria-label="Sort cities" value={sort} onChange={event=>setSort(event.target.value)}><option value="name">City A–Z</option><option value="us_aqi">Highest AQI</option><option value="pm2_5">Highest PM2.5</option></select></label>
          <div className="city-value-label">{matching.length} cities <span>{sort==='pm2_5'?'PM2.5 · µg/m³':'AQI'}</span></div>
          <div className="city-list" role="group" aria-label="Cities">
            {matching.map(city => { const reading = summary?.[city.id]?.current?.[sort==='pm2_5'?'pm2_5':'us_aqi']; return <button key={city.id} type="button" className={'city-row ' + (city.id === selected.id ? 'active' : '')} aria-pressed={city.id === selected.id} onClick={() => setSelectedId(city.id)}><span>{city.name}</span><span>{isReading(reading) ? Math.round(reading) : '—'}</span></button>; })}
            {!matching.length && <p className="list-message">No matching city.</p>}
          </div>
          {summaryError && <div className="list-error" role="status">{summaryError}</div>}
          {!summary && !summaryError && <p className="list-loading">Loading city readings…</p>}
        </aside>
        <CityMap selected={selected} onSelect={setSelectedId} summary={summary} metric={metric} onMetric={setMetric} />
        <aside className="reading-panel" aria-label={selected.name + ' air quality'}>
          <div className="rail-heading"><span>SELECTED CITY</span><i /></div>
          <h1 className={selected.name.length>10?"long-city":""}>{selected.name}</h1><p className="coordinates">{selected.lat.toFixed(4)}° N &nbsp; {selected.lon.toFixed(4)}° E</p>
          <div className="rail-rule"/><h2>AQI</h2>
          <div className="aqi-value" aria-label={isReading(aqi) ? 'AQI ' + Math.round(aqi) : 'AQI unavailable'}>{isReading(aqi) ? Math.round(aqi) : '—'}</div>
          <div className={'aqi-category tone-' + category.tone + (aqi>150?' status-alert':'')}>{category.label}</div>
          <dl className="pollutants">{[['PM2.5','pm2_5'],['PM10','pm10'],['NO₂','nitrogen_dioxide'],['SO₂','sulphur_dioxide'],['O₃','ozone'],['CO','carbon_monoxide']].map(([label,key])=><div key={key}><dt>{label}</dt><dd><strong>{display(current?.[key],1)}</strong> <span>µg/m³</span></dd></div>)}</dl>
          {detailError && <div className="detail-error" role="alert">{detailError} <button type="button" onClick={refresh}>Retry</button></div>}
          {!detail && !detailError && <p className="detail-loading" role="status">Loading detailed readings…</p>}
          <div className="cigarette-section"><h2>AIR, IN CIGARETTES</h2>
            <div className="cigarette-content"><CigaretteArt amount={cigarette ? Number(cigarette.estimate.toFixed(1)) : undefined}/><div className="cigarette-stat"><strong>{cigarette ? '~' + cigarette.estimate.toFixed(1) : '—'}</strong><span>{cigarette ? 'cigarettes / day' : 'Unavailable'}</span></div></div>
            <p>{cigarette ? '24h mean PM2.5 ' + cigarette.mean.toFixed(1) + ' µg/m³ ÷ 22' : 'Requires 24 complete hourly PM2.5 values'}</p>
            <div className="method-row"><span>Approximate exposure comparison</span><button type="button" onClick={openMethod}>Method</button></div>
          </div>
        </aside>
      </div>
      <section className="history-panel" aria-label="Air quality history"><div className="history-heading"><div><strong>HOURLY HISTORY</strong><span>·</span><span>{selected.name}</span><span>·</span><span>AQI</span></div><div className="range-tabs" aria-label="History period">{['24H', '7D', '30D'].map(item => <button key={item} type="button" className={range === item ? 'active' : ''} aria-pressed={range === item} onClick={() => setRange(item)}>{item}</button>)}</div></div>
        {detail ? <HistoryChart hourly={detail.hourly} currentTime={current.time} range={range} cityName={selected.name}/> : <div className="chart-empty">{detailError ? 'History unavailable.' : 'Loading modeled history…'}</div>}
      </section>
    </main>
    <footer className="site-footer"><span><a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> / <a href="https://atmosphere.copernicus.eu/" target="_blank" rel="noreferrer">CAMS</a><button type="button" onClick={openMethod}>Data & method</button></span><span className="ai-credit">Human designed, made with AI</span><div><span>Updated {current?.time?formatIST(current.time,{hour:'2-digit',minute:'2-digit',hour12:false})+' IST':'—'}</span><button type="button" onClick={()=>setSmokeOn(value=>!value)} aria-pressed={smokeOn}>{smokeOn?'Pause smoke':'Resume smoke'}</button><button type="button" onClick={refresh}>Refresh</button></div></footer>
    {methodOpen && <MethodDialog onClose={() => setMethodOpen(false)} cigarette={cigarette} returnFocusRef={methodTriggerRef}/>}
  </div>;
}
