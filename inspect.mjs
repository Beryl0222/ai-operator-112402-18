import {readFileSync} from 'node:fs';
import * as input from './inputs/mdct-assets.mjs';

const source=JSON.parse(readFileSync(new URL('./inputs/mdct-assets.json',import.meta.url),'utf8'));
console.log(JSON.stringify({名称:'录音页与设备窗表',首项:source['frames'],字段:Object.keys(source),取数函数:Object.keys(input)},null,2));
