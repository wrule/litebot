import { binance } from 'ccxt';
import { SMACross } from './bot/sma_cross';
import { RealSpot } from './executor/real_spot';
import { SimpleSpot } from './executor/simple_spot';
import { DingTalk } from './notifier/dingtalk';
import { KLineWatcher } from './watcher/kline_watcher';
const secret = require('./.secret.json');
const dingtalk = require('./.dingtalk.json');

async function main() {
  const exchange = new binance({ ...secret, enableRateLimit: true });
  await exchange.loadMarkets();
  const executor = new SimpleSpot(100, 0.001);
  const bot = new SMACross(executor, { fast_period: 9, slow_period: 44 });
  const watcher = new KLineWatcher();
  (await watcher.Fetch(exchange, 'ETH/USDT', '1m', 100)).forEach((item) => bot.Update(item, false));
  watcher.Start(exchange, 'ETH/USDT', '1m', 2, (kline) => {
    bot.Update(kline[0]);
  }, 1000);
}

main();
