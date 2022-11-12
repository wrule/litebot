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
class SMACross
extends Bot<TC, State, State> {
  protected calculate(tc: TC, state_queue: State[]) {
    return null as any;
  }

  protected analyze(state_queue: State[]) {
    return null as any;
  }

  protected execute(signal: State) {

  }
}
