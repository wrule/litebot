import { stoch_rsi } from '../tulind_wrapper';
import { Bot } from '.';
import { TC } from '../tc';
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
    return 100;
  }

  protected next(tcs: TC[], signal_queue: Signal[] = []): Signal[] {
    const result = signal_queue.concat(tcs as Signal[]);
    const close = result.map((item) => item.close);
    const { k, d, diff } = stoch_rsi(close, this.params);
    result.forEach((last, index) => {
      last.k = k[index];
      last.d = d[index];
      last.diff = diff[index];
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
