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
function ArrayToKLine(array: number[][]): OHLCV[] {
  const kline: OHLCV[] = [];
  let interval!: number;
  array.forEach((item, index) => {
    const ohlcv = ArrayToOHLCV(item);
    const new_interval = ohlcv.time - kline[index - 1]?.time;
    if (index > 1 && new_interval !== interval)
      console.log(`error ${ohlcv.time}`);
    interval = new_interval;
    kline.push(ohlcv);
  });
  return kline;
}
