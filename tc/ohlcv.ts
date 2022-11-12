import { OHLC } from './ohlc';

export
interface OHLCV
extends OHLC {
  volume: number;
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
  return array.map((item) => ArrayToOHLCV(item));
}
