import {readFileSync} from 'node:fs';
const data = JSON.parse(readFileSync(new URL('./mdct-assets.json', import.meta.url), 'utf8'));
function sineWindow(half) {
  return Float64Array.from({length:2*half},(_,i)=>Math.sin(Math.PI*(i+.5)/(2*half)));
}
export function mdctWindow(type) {
  const {M,m}=data;
  if(type==='short') return sineWindow(m);
  const window=sineWindow(M);
  if(type==='long') return window;
  const offset=(M-m)/2;
  const short=sineWindow(m);
  for(let j=0;j<M;j++) {
    window[M+j] = j<offset?1:j<offset+m?short[m+j-offset]:0;
  }
  if(type==='stop') return window.reverse();
  if(type!=='start') throw new RangeError('未知过渡窗');
  return window;
}
export function voiceBlock(page, channel) {
  return Float64Array.from({length:data.m*2},(_,i)=>{
    const sample=page*data.m*2+i;
    return Math.sin((sample+channel)*.21)*.0625 + (sample%541<23 ? Math.sin(sample*.831)*.75:0);
  });
}
