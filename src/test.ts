
import { ArrayToKLine, ccxt, SpotSimpleTest } from '.';
import { KLineWatcherRT } from './watcher/kline_watcher_rt';

const secret = require('../.secret.json');
const data = require('../src/data/ETH_USDT-30m.json');

async function main() {
  const exchange = new ccxt.binance(secret.exchange);
  const ticker = await exchange.fetchTicker('ETH/USDT');
  console.log(ticker);
}

main();
