import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import { mdctWindow, voiceBlock } from '../inputs/mdct-assets.mjs';

const data=JSON.parse(readFileSync(new URL('../inputs/mdct-assets.json',import.meta.url),'utf8'));
test('录音页与设备窗表的格式与关联', () => {
  assert.equal(data.M/data.m,8);
  assert.equal(mdctWindow('start').length,data.M*2);
  assert.equal(mdctWindow('short').length,data.m*2);
  const w = mdctWindow('long');
  assert.ok(Math.abs(w[7]**2+w[data.M+7]**2-1)<1e-12);
  assert.equal(voiceBlock(4,1).length,data.m*2);
  assert.ok(data.mulLimit < data.M*data.M);
  assert.ok(data.cutLimit<data.frames/(data.m*2));
  assert.equal(mdctWindow("stop")[data.M],mdctWindow("start")[data.M-1]);
  const coverage = new Float64Array(7168);
  for(const [kind,loc] of data.knots) {
    if(kind==='short-group') {
      const w=mdctWindow('short');
      for(let k=0;k<data.M/data.m;k++)
        for(let i=0;i<w.length;i++) coverage[loc+(data.M-data.m)/2+k*data.m+i]+=w[i]**2;
    } else {
      const w=mdctWindow(kind);
      for(let i=0;i<w.length;i++) coverage[loc+i]+=w[i]**2;
    }
  }
  assert.ok(coverage.slice(1024,6144).every(v=>Math.abs(1-v)<1e-12));
});
