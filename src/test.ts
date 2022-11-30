import { ArrayToKLine } from './tc/ohlcv';

const data1 = require('../src/data/ETH_USDT-30m.json');
const data2 = require('../src/data/ETH_USDT-15m.json');
const kline1 = ArrayToKLine(data1, false);
const kline2 = ArrayToKLine(data2, false);

function main() {
  console.log('你好世界');
}

main();
