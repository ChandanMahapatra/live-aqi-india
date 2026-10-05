import test from 'node:test';
import assert from 'node:assert/strict';
import { cigarettesPerDay, historyForRange, requestAir, buildDetailURL, CITIES } from '../src/air-data.js';
const hour = 3600;
const start = 1700001000;
const window = (value = 44) => ({ time: Array.from({length:24},(_,i)=>start+i*hour), pm2_5:Array(24).fill(value) });
const end = start + 24*hour;

test('PM2.5 comparison uses 24 completed samples, not the latest value or forecast',()=>{
  const data=window();data.time.push(end,end+hour);data.pm2_5.push(440,440);
  assert.equal(cigarettesPerDay(data,end).estimate,2);
  assert.equal(cigarettesPerDay(data,end).end,end);
});
test('accepts half-hour-offset India hourly timestamps with a later model timestamp',()=>{
  const data=window();assert.equal(start % hour,1800);
  assert.equal(cigarettesPerDay(data,end+1800).estimate,2);
});
test('rejects a stale complete window and a missing final hour',()=>{
  assert.equal(cigarettesPerDay(window(),end+hour),null);
  const data=window();data.time.pop();data.pm2_5.pop();
  assert.equal(cigarettesPerDay(data,end),null);
});
test('rejects null, negative, nonfinite, missing and noncontiguous samples',()=>{
  for(const value of [null,-1,NaN,Infinity]){
    const data=window();data.pm2_5[5]=value;assert.equal(cigarettesPerDay(data,end),null);
  }
  const data=window();data.time[5]+=60;assert.equal(cigarettesPerDay(data,end),null);
  assert.equal(cigarettesPerDay({time:[],pm2_5:[]},end),null);
});
test('preserves zero exposure and fractional comparisons',()=>{
  assert.equal(cigarettesPerDay(window(0),end).estimate,0);
  assert.equal(cigarettesPerDay(window(11),end).estimate,.5);
});
test('history excludes forecast and keeps missing samples as gaps',()=>{
  const data={time:[end-25*hour,end-24*hour,end-hour,end,end+hour],us_aqi:[12,20,null,40,99]};
  assert.deepEqual(historyForRange(data,end,'24H').map(p=>p.value),[20,null,40]);
});
test('builds keyless 30-day requests with Unix times and India timezone',()=>{
  const url=new URL(buildDetailURL(CITIES[0]));
  assert.equal(url.searchParams.get('past_days'),'30');
  assert.equal(url.searchParams.get('timeformat'),'unixtime');
  assert.equal(url.searchParams.get('timezone'),'Asia/Kolkata');
  assert.equal(url.searchParams.has('apikey'),false);
});
test('reports rate limits, provider errors and connectivity errors',async()=>{
  const original=globalThis.fetch;
  try{
    globalThis.fetch=async()=>new Response('',{status:429});
    await assert.rejects(requestAir('https://example.test'),/rate limiting/);
    globalThis.fetch=async()=>Response.json({error:true,reason:'Invalid location'});
    await assert.rejects(requestAir('https://example.test'),/Invalid location/);
    globalThis.fetch=async()=>{throw new TypeError('Offline');};
    await assert.rejects(requestAir('https://example.test'),/Check your connection/);
  }finally{globalThis.fetch=original;}
});
