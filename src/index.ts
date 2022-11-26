import { ArrayToKLine } from './tc/ohlcv';

async function main() {
  const data = require('../data/ETH_USDT-30m.json');
  const kline = ArrayToKLine(data);
  console.log('你好，世界', kline[kline.length - 1].close);
}

main();
