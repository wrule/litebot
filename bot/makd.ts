import { sma, _align } from 'tulind-wrapper';
import { TC } from '../tc';
import { Bot } from '.';
import { FullSpot } from '../executor/full_spot';

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
class MAKD
extends Bot<TC, Signal> {
  public constructor(
    private readonly executor: FullSpot,
    private readonly params: {
      fast_period: number,
      slow_period: number,
      k_period: number,
      d_period: number,
    },
  ) {
    super();
  }

  public get length() {
    return 1000;
  }

  protected next(tcs: TC[], queue: Signal[] = []) {
    const result = queue.concat(tcs as Signal[]);
    const close = result.map((item) => item.close);
    const slow_line = sma(close, this.params.slow_period);
    const fast_line = sma(close, this.params.fast_period, slow_line.length);
    const diff = fast_line.map((item, index) => item - slow_line[index]);
    const k = sma(diff, this.params.k_period);
    const d = sma(k, this.params.d_period);
    _align([k, d], close.length);
    result.forEach((last, index) => {
      last.k = k[index];
      last.d = d[index];
      last.diff = k[index] - d[index];
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
