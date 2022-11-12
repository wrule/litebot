import { SMACross } from './bot/sma_cross';
import { ArrayToKLine } from './tc/ohlcv';
import moment from 'moment';
const data = require('./data/ETH_USDT-30m.json');

async function main() {
  const kline = ArrayToKLine(data);
  const bot = new SMACross({ queue_size: 100, params: { fast_period: 9, slow_period: 44 } });
  bot.BackTesting(kline);
}

main();

