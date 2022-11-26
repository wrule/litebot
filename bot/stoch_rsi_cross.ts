#!/usr/bin/env node
import { rsi, stoch, rsi_start, stoch_start } from 'tulind-wrapper';
import { TC } from '../tc';
import { Bot } from '.';
import { FullSpot } from '../executor/full_spot';
import { fill_params } from '../app';
import { DingTalk } from '../notifier/dingtalk';
import { binance } from 'ccxt';
import { RealSpot } from '../executor/real_spot';
import { KLineWatcher } from '../watcher/kline_watcher';

export
interface Signal
extends TC {
  k: number;
  d: number;
  diff: number;
  buy: boolean;
  sell: boolean;
}

export
class StochRSICross
extends Bot<TC, Signal> {
  public constructor(
    private readonly executor: FullSpot,
    private readonly params: {
      rsi_period: number,
      stoch_period: number,
      k_period: number,
      d_period: number,
    },
  ) {
    super();
  }

  public get length() {
    return (rsi_start(this.params.rsi_period) + stoch_start({
      k_slowing_period: this.params.k_period,
      k_period: this.params.stoch_period,
      d_period: this.params.d_period,
    }) + 2) * 4;
  }

  protected next(tcs: TC[], queue: Signal[] = []) {
    const result = queue.concat(tcs as Signal[]);
    const close = result.map((item) => item.close);
    const rsi_result = rsi(close, this.params.rsi_period);
    const { stoch_k, stoch_d } = stoch(rsi_result, rsi_result, rsi_result, {
      k_slowing_period: this.params.k_period,
      k_period: this.params.stoch_period,
      d_period: this.params.d_period,
    }, close.length);
    result.forEach((last, index) => {
      last.k = stoch_k[index];
      last.d = stoch_d[index];
      last.diff = stoch_k[index] - stoch_d[index];
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
  if (require.main !== module) return;
  const secret = require('../.secret.json');
  const params = {
    name: '红眼',
    symbol: 'ETH/USDT',
    timeframe: '1m',
    rsi_period: 2,
    stoch_period: 3,
    k_period: 4,
    d_period: 5,
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
  // const executor = new SimpleSpot();
  const bot = new StochRSICross(executor, params);
  new KLineWatcher().RunBot({ exchange, bot, ...params });
})();
