import tulind from 'tulind';
import { Bot } from '.';
import { TC } from '../tc';

export
interface Executor {
  BuyAll: (price: number) => void;
  SellAll: (price: number) => void;
}

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
interface Params {
  fast_period: number;
  slow_period: number;
}

export
class SMACross
extends Bot<TC, Signal, Params> {
  public constructor(private readonly executor: Executor, params: Params) {
    super({ params });
  }

  private sma(source: number[], size: number) {
    let result!: number[];
    tulind.indicators.sma.indicator([source], [size], (error: any, data: any) => {
      if (error) throw error;
      result = Array(tulind.indicators.sma.start([size])).fill(NaN).concat(data[0]);
    });
    return result;
  }

  public ReadyLength() {
    return this.config.params.slow_period + 1;
  }

  protected next(tcs: TC[], signal_queue: Signal[] = []): Signal[] {
    const result = signal_queue.concat(tcs as Signal[]);
    const close = result.map((item) => item.close);
    const fast_line = this.sma(close, this.config.params.fast_period);
    const slow_line = this.sma(close, this.config.params.slow_period);
    result.forEach((last, index) => {
      last.sma_fast = fast_line[index];
      last.sma_slow = slow_line[index];
      last.diff = last.sma_fast - last.sma_slow;
      last.buy = result[index - 1]?.diff <= 0 && last.diff > 0;
      last.sell = result[index - 1]?.diff >= 0 && last.diff < 0;
    });
    return result;
  }

  protected execute(signal: Signal) {
    if (signal.sell) {
      this.executor.SellAll(signal.close);
    } else if (signal.buy) {
      this.executor.BuyAll(signal.close);
    }
  }
}
