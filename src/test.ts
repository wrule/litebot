
import { ArrayToKLine, ccxt, SpotSimpleTest } from '.';
import { KLineWatcherRT } from './watcher/kline_watcher_rt';

const secret = require('../.secret.json');
const data = require('../src/data/ETH_USDT-30m.json');

function main() {
  const kline = ArrayToKLine(data);
  // const exchange = new ccxt.binance(secret.exchange);
  // const watcher = new KLineWatcherRT();
  // watcher.start(exchange, 'ETH/USDT', '1m', (data) => {
  //   const [hist, active] = data;
  //   console.log(hist.close, active.close);
  // });
}

main();
