import { ArrayToKLine, FillHighFirst } from './tc/ohlcv';
import fs from 'fs';

const data1 = require('../src/data/ETH_USDT-30m.json');
const data2 = require('../src/data/ETH_USDT-1m.json');
const kline1 = ArrayToKLine(data1, false);
const kline2 = ArrayToKLine(data2, false);

function main() {
  console.log('你好世界');
  FillHighFirst(kline1, kline2);
  console.log(kline1.every((item) => item.high_first != null));
  fs.writeFileSync('output1.json', JSON.stringify(kline1, null, 2));
  fs.writeFileSync('output2.json', JSON.stringify(kline2, null, 2));
}

main();
