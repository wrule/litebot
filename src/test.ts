
import 'global-agent/bootstrap';
import { ArrayToKLine, ccxt, SpotReal, SpotSimpleTest } from '.';
import { KLineWatcherRT } from './watcher/kline_watcher_rt';

const secret = require('../.secret.json');
// const data = require('../src/data/ETH_USDT-30m.json');

async function main() {
  const exchange = new ccxt.binance(secret.exchange);
  const spot = new SpotReal({
    name: '测试', exchange, symbol: 'ETH/USDT', funds: 15, assets: 0,
  });
  await spot.BuyAll(1900);
  // const ticker = await exchange.fetchTicker('ETH/USDT');
  // console.log(ticker);
}

main();
