import { ArrayToKLine } from './tc/ohlcv';
import { stoch_rsi } from './tulind_wrapper';
import moment from 'moment';

const data = require('./data/ETH_USDT-2h.json');
const kline = ArrayToKLine(data);
const close = kline.map((item) => item.close);
const { k, d, diff } = stoch_rsi(close, {
  rsi_period: 13,
  stoch_period: 45,
  k_period: 32,
  d_period: 45,
});
console.log(close.length, k.length);
console.log(diff.slice(diff.length - 10));
console.log(moment(new Date(kline[kline.length - 1].time)).format('YYYY-MM-DD HH:mm:ss'));
