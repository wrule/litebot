import { binance } from 'ccxt';
import { SMACross } from './bot/sma_cross';
import { SimpleSpot } from './executor/simple_spot';
import { KLineWatcherLite } from './watcher/kline_watcher_lite';

async function main() {
  const exchange = new binance({ });
  console.log('loading market...');
  await exchange.loadMarkets();
  const executor = new SimpleSpot(100, 0.001);
  const bot = new SMACross(executor, { fast_period: 9, slow_period: 44 });
  new KLineWatcherLite().RunBot(exchange, 'ETH/USDT', '1m', bot, 0);
}

main();
