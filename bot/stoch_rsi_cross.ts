import { rsi, stoch, rsi_start, stoch_start } from 'tulind-wrapper';
import { TC } from '../tc';
import { Bot } from '.';
import { FullSpot } from '../executor/full_spot';

export
interface Params {
  rsi_period: number,
  stoch_period: number,
  k_period: number,
  d_period: number,
}

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
extends Bot<TC, Params, Signal> {
  public constructor(private readonly executor: FullSpot, params: Params) {
    super(params);
  }

  public length() {
    return ((rsi_start(this.params.rsi_period) + stoch_start({
      k_slowing_period: this.params.k_period,
      k_period: this.params.d_period,
      d_period: this.params.stoch_period,
    })) + 2) * 4;
  }

  protected next(tcs: TC[], signal_queue: Signal[] = []): Signal[] {
    const result = signal_queue.concat(tcs as Signal[]);
    const close = result.map((item) => item.close);
    const rsi_result = rsi(close, this.params.rsi_period);
    const { stoch_k, stoch_d } = stoch(rsi_result, rsi_result, rsi_result, {
      k_slowing_period: this.params.k_period,
      k_period: this.params.d_period,
      d_period: this.params.stoch_period,
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
