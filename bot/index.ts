import { SimpleSpot } from '../executor/simple_spot';
import { TC } from '../tc';

export
abstract class Bot<T extends TC, Params, Signal extends T> {
  public constructor(protected readonly config: {
    params: Params,
  }) { }

  private signal_queue: Signal[] = [];
  protected simple_spot = new SimpleSpot();

  public get SignalQueue() {
    return this.signal_queue;
  }

  public get SimpleSpot() {
    return this.simple_spot;
  }

  public Update(tc: T, enable = true) {
    this.signal_queue = this.next([tc], this.signal_queue);
    enable && this.exec(this.signal_queue[this.signal_queue.length - 1]);
    this.signal_queue.splice(0, this.signal_queue.length - this.length() + 1);
  }

  public BackTestingSimulation(tcs: T[]) {
    this.simple_spot.Reset();
    tcs.forEach((tc) => this.Update(tc));
  }

  public BackTestingBatch(tcs: T[]) {
    this.simple_spot.Reset();
    this.next(tcs, []).forEach((signal) => this.exec(signal));
  }

  public abstract length(): number;

  protected abstract next(tc: T[], signal_queue: Signal[]): Signal[];

  protected abstract exec(signal: Signal): void;
}
