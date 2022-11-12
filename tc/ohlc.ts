import { TC } from '.';

export
interface OHLC
extends TC {
  open: number;
  high: number;
  low: number;
  high_first?: boolean;
}
