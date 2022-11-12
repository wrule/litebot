import { TC } from '../tc';

export
abstract class Bot<
  T extends TC,
  State extends T,
  Signal extends State
> {
  private state_queue: State[] = [];

  public Update(tc: T) {
    const new_state = this.calculate(tc, this.state_queue);
    this.state_queue.push(new_state);
  }

  protected abstract calculate(tc: T, state_queue: State[]): State;

  protected abstract analyze(state_queue: State[]): Signal;

  protected abstract execute(signal: Signal): void;
}
