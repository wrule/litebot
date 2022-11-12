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
class SMACross
extends Bot<TC, State, Signal> {
  private sma(source: number[], size: number) {
    let result!: number[];
    tulind.indicators.sma.indicator([source], [size], (error: any, data: any) => {
      if (error) throw error;
      result = data[0];
    });
    return result;
  }

  protected ready_length() {
    return 44;
  }

  protected calculate(tc: TC, state_queue: State[]): State {
    const source = state_queue.map((state) => state.close).concat([tc.close]);
    const fast_line = this.sma(source, 9);
    const slow_line = this.sma(source, 44);
    const sma_fast = fast_line[fast_line.length - 1];
    const sma_slow = slow_line[slow_line.length - 1];
    const diff = sma_fast - sma_slow;
    return { ...tc, sma_fast, sma_slow, diff };
  }

  protected analyze(state_queue: State[]): Signal {
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
