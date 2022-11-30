import moment from 'moment';
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
  let count = 1;
  array.forEach((item, index) => {
    const curr = ArrayToOHLCV(item);
    kline.push(curr);
    if (check_interval && index > 0) {
      const prev = kline[index - 1];
      const interval = curr.time - prev.time;
      if (interval !== (check_interval === true ? kline[1].time - kline[0].time : check_interval)) {
        console.log(count++, 'interval error:');
        console.log(moment(new Date(prev.time)).format('YYYY-MM-DD HH:mm:ss'), prev.time);
        console.log(moment(new Date(curr.time)).format('YYYY-MM-DD HH:mm:ss'), curr.time);
        console.log('');
      }
    }
  });
  return kline;
}

export
function FillHighFirst(kline1: OHLCV[], kline2: OHLCV[], default_high_first = false) {
  const ot = Number(new Date());
  let index2 = 0;
  kline1.forEach((item1, index1) => {
    while (kline2[index2]?.time < item1.time) index2++;
    let high_time!: number, low_time!: number;
    while (kline2[index2]?.time < kline1[index1 + 1]?.time) {
      const item2 = kline2[index2++];
      if (item2.low <= item1.low) low_time = low_time || item2.time;
      if (item2.high >= item1.high) high_time = high_time || item2.time;
    }
  });
  console.log(Number(new Date()) - ot);
}
