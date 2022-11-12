import { SMACross } from './bot/sma_cross';
import { ArrayToKLine } from './tc/ohlcv';
const data = require('./data/ETH_USDT-30m.json');

async function main() {
  const kline = ArrayToKLine(data);
  const bot = new SMACross({ params: { fast_period: 9, slow_period: 44 } });
  const old_time = Number(new Date());
  bot.BackTesting(kline);
  console.log(Number(new Date()) - old_time);
}

main();

