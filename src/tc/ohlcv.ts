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
  kline1.forEach((item, index) => {
    const start = item.time;
    const end = kline1[index + 1]?.time;
    while (kline2[index2]?.time < start) index2++;
    if (kline2[index2]?.time === start) {
      while (kline2[index2]?.time < end) {
        index2++;
        if (kline2[index2].low <= item.low) {
          item.high_first = false;
          break;
        }
        if (kline2[index2].high >= item.high) {
          item.high_first = true;
          break;
        }
      }
    }
  });
  console.log(Number(new Date()) - ot);
}
