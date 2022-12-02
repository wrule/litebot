
import { ccxt, SpotSimpleTest } from '.';
import { KLineWatcherRT } from './watcher/kline_watcher_rt';

const secret = require('../.secret.json');

function main() {
  const exchange = new ccxt.binance(secret.exchange);
  const watcher = new KLineWatcherRT();
  watcher.start(exchange, 'ETH/USDT', '1m', (data) => {
    const [hist, active] = data;
    console.log(hist.close, active.close);
  });
}

main();
