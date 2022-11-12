import { TC } from '../tc';

export
abstract class Bot<
  T extends TC,
  State extends T,
  Signal extends State,
  Params,
> {
  public constructor(protected readonly config: {
    params: Params,
  }) { }

  private state_queue: State[] = [];

  public Update(tc: T) {
    const states = this.calculate(tc, this.state_queue);
    this.state_queue.push(states[states.length - 1]);
    const signals = this.analyze(this.state_queue);
    this.execute(signals[signals.length - 1]);
    this.state_queue.splice(0, this.state_queue.length - this.ready_length());
  }

  public BackTesting(data: T[]) {
    for (let i = 0; i < data.length; ++i) {
      this.Update(data[i]);
    }
  }

  protected abstract ready_length(): number;

  protected abstract calculate(tc: T, state_queue: State[]): State[];

  protected abstract analyze(state_queue: State[]): Signal[];

  protected abstract execute(signal: Signal): void;
}
