import { binance } from 'ccxt';
import { SMACross } from './bot/sma_cross';
import { RealSpot } from './executor/real_spot';
import { SimpleSpot } from './executor/simple_spot';
import { DingTalk } from './notifier/dingtalk';
import { KLineWatcher } from './watcher/kline_watcher';
const secret = require('./.secret.json');
const dingtalk = require('./.dingtalk.json');

async function main() {
  const notifier = new DingTalk(dingtalk);
  const exchange = new binance({ ...secret, enableRateLimit: true });
  console.log('加载市场...');
  await exchange.loadMarkets();
  const executor = new SimpleSpot(100, 0.001);
  const bot = new SMACross(executor, { fast_period: 9, slow_period: 44 });
  const watcher = new KLineWatcher();
  (await watcher.Fetch(exchange, 'ETH/USDT', '1m', 100)).forEach((item) => bot.Update(item, false));
  watcher.

  // const spot = new RealSpot({ exchange, symbol: 'UNI/USDT', init_funds: 15, init_assets: 0, notifier });
  // console.log('发起交易...');
  // await spot.BuyAll(5);
  // await spot.SellAll(5);
  // console.log('结束交易');
}

main();
