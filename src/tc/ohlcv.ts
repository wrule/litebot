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
function ArrayToKLine(array: number[][], check_interval: boolean | number = true): OHLCV[] {
  const kline: OHLCV[] = [];
  array.forEach((item, index) => {
    const ohlcv = ArrayToOHLCV(item);
    kline.push(ohlcv);
  });
  return kline;
}
