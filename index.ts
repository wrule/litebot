import { Params, SMACross } from './bot/sma_cross';
import { Random } from './optimizer/random';
import { ArrayToKLine } from './tc/ohlcv';
const data = require('./data/ETH_USDT-30m.json');

async function main() {
  const kline = ArrayToKLine(data);

  const op = new Random<Params>();
  op.Search({
    domain: {
      fast_period: [2, 100],
      slow_period: [2, 100],
    },
    target: (params) => {
      const bot = new SMACross({ params });
      bot.BackTestingBatch(kline);
      return bot.SimpleSpot.ROI(kline[kline.length - 1].close);
    },
    params_mapper: (value) => ({
      fast_period: Math.min(value.fast_period, value.slow_period),
      slow_period: Math.max(value.fast_period, value.slow_period),
    }),
  });
}

main();
