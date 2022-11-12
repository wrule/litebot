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
    this.state_queue.push(this.calculate(tc, this.state_queue));
    this.state_queue.length >= this.ready_length() && this.execute(this.analyze(this.state_queue));
    this.state_queue.splice(0, this.state_queue.length - this.ready_length());
  }

  public BackTesting(data: T[]) {
    for (let i = 0; i < data.length; ++i) {
      this.Update(data[i]);
    }
  }

  protected abstract ready_length(): number;

  protected abstract calculate(tc: T, state_queue: State[]): State;

  protected abstract analyze(state_queue: State[]): Signal;

  protected abstract execute(signal: Signal): void;
}
