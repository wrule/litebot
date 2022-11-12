import { TC } from './tc';

export
interface OHLC
extends TC {
  open: number;
  high: number;
  low: number;  
}
