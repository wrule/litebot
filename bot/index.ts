import { TC } from '../tc';

export
abstract class Bot<
  T extends TC,
  Signal extends T,
  Params,
> {
  public constructor(protected readonly config: {
    params: Params,
  }) { }

  private signal_queue: Signal[] = [];

  public Update(tc: T) {
    this.signal_queue = this.calculate([tc], this.signal_queue);
    this.execute(this.signal_queue[this.signal_queue.length - 1]);
    this.signal_queue.splice(0, this.signal_queue.length - this.ready_length() + 1);
  }

  public BackTestingSimulation(tcs: T[]) {
    tcs.forEach((tc) => this.Update(tc));
  }

  public BackTestingBatch(data: T[]) {
    this.calculate(data, []).forEach((signal) => this.execute(signal));
  }

  protected abstract ready_length(): number;

  protected abstract calculate(tc: T[], state_queue: Signal[]): Signal[];

  protected abstract execute(signal: Signal): void;
}
