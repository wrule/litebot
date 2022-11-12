import { TC } from '../tc';

export
abstract class Bot<
  T extends TC,
  State extends T,
  Signal extends State
> {
  public constructor(private readonly config: { queue_size: number }) {}

  private state_queue: State[] = [];

  public Update(tc: T) {
    this.state_queue.push(this.calculate(tc, this.state_queue));
    this.state_queue.length >= this.ready_length() && this.execute(this.analyze(this.state_queue));
    this.state_queue.splice(0, this.state_queue.length - this.config.queue_size);
  }

  protected abstract ready_length(): number;

  protected abstract calculate(tc: T, state_queue: State[]): State;

  protected abstract analyze(state_queue: State[]): Signal;

  protected abstract execute(signal: Signal): void;
}
