import moment from 'moment';
import { rsi, stoch } from 'tulind-wrapper';
import { ArrayToKLine } from './tc/ohlcv';

const data = require('./data/ETH_USDT-30m.json');

async function main() {
  const kline = ArrayToKLine(data);
  const close = kline.map((item) => item.close);
  const rsi_result = rsi(close, { period: 13 });
  const stoch_result = stoch(rsi_result, rsi_result, rsi_result, {
    k_period: 45,
    k_slowing_period: 32,
    d_period: 45,
  }, close.length);
  console.log(stoch_result.stoch_k.slice(stoch_result.stoch_k.length - 10));
  console.log(moment(new Date(kline[kline.length - 1].time)).format('YYYY-MM-DD HH:mm:ss'));
}

main();
