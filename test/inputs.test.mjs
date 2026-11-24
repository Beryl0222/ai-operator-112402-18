import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const d = JSON.parse(readFileSync(new URL('../inputs/session.json', import.meta.url), 'utf8'));

test("上支和门支的输入输出维数", () => {
  assert.ok(d.groups.every(g=>[g.up,g.gate,g.upErr,g.gateErr].every(a=>a.length===g.coords.length) && g.up.every(row=>row.length===d.inputs[0].x.length)));
});

test("修订有实际逻辑通道搬迁", () => {
  assert.ok(d.contractVersions[0].map.light[1]!==d.contractVersions[1].map.light[1]);
});

test("过宽的读屏误差与错裁切的投影均可表达", () => {
  assert.ok(d.groups[0].upErr[1]>d.profiles.reader.tolerance.tone && d.events[2][1]!==d.events[1][1]);
});
