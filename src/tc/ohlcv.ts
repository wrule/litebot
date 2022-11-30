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
function FillHighFirst(kline1: OHLCV[], kline2: OHLCV[], true_probability = 0.5, log = false) {
  const ot = Number(new Date());
  let missing_counter = 0;
  let overlap_counter = 0;
  let index2 = 0;
  kline1.forEach((item1, index1) => {
    let high_time!: number, low_time!: number;
    while (kline2[index2]?.time < item1.time) index2++;
    while (kline2[index2]?.time < (kline1[index1 + 1]?.time || Infinity)) {
      const item2 = kline2[index2];
      if (item2.high >= item1.high) high_time = high_time || item2.time;
      if (item2.low <= item1.low) low_time = low_time || item2.time;
      index2++;
    }
    if (high_time && low_time) {
      if (high_time < low_time) item1.high_first = true;
      if (high_time > low_time) item1.high_first = false;
      if (high_time === low_time) {
        ++overlap_counter;
        log && console.log(overlap_counter, 'overlap', moment(high_time).format('YYYY-MM-DD HH:mm:ss'), high_time);
        item1.high_first = Math.random() < true_probability;
      }
    } else {
      ++missing_counter;
      log && console.log(missing_counter, 'missing', moment(item1.time).format('YYYY-MM-DD HH:mm:ss'), item1.time);
      item1.high_first = Math.random() < true_probability;
    }
  });
  log && console.log('counterfeit_rate', (missing_counter + overlap_counter) / kline1.length * 100, '%');
  console.log(Number(new Date()) - ot);
}
