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
    this.signal_queue.splice(0, this.signal_queue.length - this.ready_length());
  }

  public BackTesting(data: T[]) {
    for (let i = 0; i < data.length; ++i) {
      this.Update(data[i]);
    }
  }

  protected abstract ready_length(): number;

  protected abstract calculate(tc: T[], state_queue: Signal[]): Signal[];

  protected abstract execute(signal: Signal): void;
}
