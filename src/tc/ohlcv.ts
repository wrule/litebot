import moment from 'moment';
import { TC } from '.';

export
interface OHLCV
extends TC {
  open: number;
  high: number;
  low: number;
  volume: number;
  unclosed?: boolean;
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
function ExpandKLine(kline: OHLCV[]) {
  const result: OHLCV[] = [];
  kline.forEach((item) => {
    result.push({ ...item, close: item.open, unclosed: true });
    result.push({ ...item, close: item.high, unclosed: true });
    result.push({ ...item, close: item.low, unclosed: true });
    result.push({ ...item, unclosed: false });
  });
  return result;
}
