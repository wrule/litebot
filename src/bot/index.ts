// 2022年12月08日22:51:52
import { TC } from '../tc';

export
abstract class Bot<T extends TC, Signal extends T> {
  protected queue: Signal[] = [];

  public Update(tc: T, enable = true, log = true) {
    this.queue = this.next([tc], this.queue);
    const last = this.last;
    enable && this.exec(last);
    log && console.log(last);
    this.queue.splice(0, this.queue.length - this.length + 1);
  }

  public BackTestingSimulation(tcs: T[]) {
    tcs.forEach((tc) => this.Update(tc, true, false));
  }

  public BackTestingBatch(tcs: T[]) {
    this.next(tcs, []).forEach((signal) => this.exec(signal));
  }

  public get last() {
    return this.queue[this.queue.length - 1];
  }

  public abstract length: number;

  public abstract next(tcs: T[], queue: Signal[]): Signal[];

  public abstract exec(signal: Signal): void;
}
