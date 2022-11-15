import moment from 'moment';
import { binance } from 'ccxt';
import { SMACross } from './bot/sma_cross';
import { SimpleSpot } from './executor/simple_spot';
import { KLineWatcher } from './watcher/kline_watcher';

const secret = require('./.secret.json');
const dingtalk = require('./.dingtalk.json');

async function main() {
  const exchange = new binance({ ...secret, enableRateLimit: true });
  console.log('加载市场...');
  await exchange.loadMarkets();
  const executor = new SimpleSpot(100, 0.001);
  const bot = new SMACross(executor, { fast_period: 9, slow_period: 44 });
  const watcher = new KLineWatcher();
  console.log('初始化机器人...');
  (await watcher.Fetch(exchange, 'ETH/USDT', '1m', bot.ReadyLength())).forEach((item) => bot.Update(item, false));
  console.log('监控市场...');
  watcher.Start(exchange, 'ETH/USDT', '1m', 1, (kline) => {
    if (kline[0]?.time > bot.SignalQueue[bot.SignalQueue.length - 1]?.time) {
      console.log(moment(new Date(kline[0].time)).format('YYYY-MM-DD HH:mm:ss'))
      bot.Update(kline[0]);
    }
  }, 1000);
}

main();
