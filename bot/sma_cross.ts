import { sma } from 'tulind-wrapper';
import { Bot } from '.';
import { TC } from '../tc';
import { FullSpot } from '../executor/full_spot';
import { fill_params } from '../app';
import { DingTalk } from '../notifier/dingtalk';
import { binance } from 'ccxt';
import { RealSpot } from '../executor/real_spot';
import { KLineWatcher } from '../watcher/kline_watcher';

export
interface Signal
extends TC {
  sma_fast: number;
  sma_slow: number;
  diff: number;
  buy: boolean;
  sell: boolean;
}

export
class SMACross
extends Bot<TC, Signal> {
  public constructor(
    private readonly executor: FullSpot,
    private readonly params: {
      fast_period: number;
      slow_period: number;
    },
  ) {
    super();
  }

  public get length() {
    return this.params.slow_period + 1;
  }

  protected next(tcs: TC[], queue: Signal[] = []): Signal[] {
    const result = queue.concat(tcs as Signal[]);
    const close = result.map((item) => item.close);
    const fast_line = sma(close, this.params.fast_period, true);
    const slow_line = sma(close, this.params.slow_period, true);
    result.forEach((last, index) => {
      last.sma_fast = fast_line[index];
      last.sma_slow = slow_line[index];
      last.diff = last.sma_fast - last.sma_slow;
      last.buy = result[index - 1]?.diff <= 0 && last.diff > 0;
      last.sell = result[index - 1]?.diff >= 0 && last.diff < 0;
    });
    return result;
  }

  protected exec(signal: Signal) {
    if (signal.sell) {
      this.executor.SellAll(signal.close);
    } else if (signal.buy) {
      this.executor.BuyAll(signal.close);
    }
  }
}

(async () => {
  console.log(1);
  if (require.main === module) return;
  console.log(2);
  const secret = require('../.secret.json');
  const params = {
    name: 'v2-test',
    symbol: 'ETH/USDT',
    timeframe: '1m',
    fast_period: 10,
    slow_period: 40,
    interval: 0,
    funds: 15,
    assets: 0,
  };
  fill_params(params);
  const notifier = new DingTalk(secret.notifier);
  const exchange = new binance(secret.exchange);
  console.log('loading market...');
  await exchange.loadMarkets();
  const executor = new RealSpot({ exchange, notifier, ...params });
  const bot = new SMACross(executor, params);
  new KLineWatcher().RunBot({ exchange, bot, ...params });
})();
