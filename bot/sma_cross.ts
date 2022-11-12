import tulind from 'tulind';
import { Bot } from '.';
import { TC } from '../tc';

export
interface State
extends TC {
  sma_fast: number;
  sma_slow: number;
  diff: number;
}

export
interface Signal
extends State {
  buy?: boolean;
  sell?: boolean;
}

export
interface Params {
  fast_period: number;
  slow_period: number;
}

export
class SMACross
extends Bot<TC, State, Signal, Params> {
  private sma(source: number[], size: number) {
    let result!: number[];
    tulind.indicators.sma.indicator([source], [size], (error: any, data: any) => {
      if (error) throw error;
      result = Array(tulind.indicators.sma.start([size])).fill(null).concat(data[0]);
    });
    return result;
  }

  protected ready_length() {
    return this.config.params.slow_period + 1;
  }

  protected calculate(tc: TC, state_queue: State[]): State[] {
    const source = state_queue.concat([tc as State]);
    const close = source.map((item) => item.close);
    const fast_line = this.sma(close, this.config.params.fast_period);
    const slow_line = this.sma(close, this.config.params.slow_period);
    const last = source[source.length - 1];
    last.sma_fast = fast_line[fast_line.length - 1];
    last.sma_slow = slow_line[slow_line.length - 1];
    last.diff = last.sma_fast - last.sma_slow;
    return source;
  }

  protected analyze(state_queue: State[]): Signal[] {
    const last = state_queue[state_queue.length - 1];
    const prev = state_queue[state_queue.length - 2];
    const buy = prev.diff <= 0 && last.diff > 0;
    const sell = prev.diff >= 0 && last.diff < 0;
    return { ...last, buy, sell };
  }

  protected execute(signal: Signal) {
    if (signal.sell) {
      // 卖
    } else if (signal.buy) {
      // 买
    }
  }
}
