import { TC } from '.';

export
interface OHLCV
extends TC {
  open: number;
  high: number;
  low: number;
  volume: number;
  high_first?: boolean;
}

export
function ArrayToOHLCV(array: number[]): OHLCV {
  return {
    time: array[0],
    open: array[1],
    high: array[2],
    low: array[3],
    close: array[4],
    volume: array[5],
  };
}

export
function ArrayToKLine(array: number[][], check_interval: number): OHLCV[] {
  const kline: OHLCV[] = [];
  array.forEach((item, index) => {
    const curr = ArrayToOHLCV(item);
    if (index > 0) {
      const prev = kline[index - 1];
      const interval = curr.time - prev.time;
      if (interval !== check_interval) {
        console.log('error');
      }
    }
    kline.push(curr);
  });
  return kline;
}
