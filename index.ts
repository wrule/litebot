import { rsi, rsi_start, stoch } from 'tulind-wrapper';

async function main() {
  const close = [2, 2, 3, 1, 9, 2, 8, 9, 10, 11, 10, 9, 9, 10, 9, 9, 1, 9, 1, 9, 8];
  const rsi_result = rsi(close, { period: 3 });
  const stoch_result = stoch(rsi_result, rsi_result, rsi_result, {
    k_period: 2,
    k_slowing_period: 2,
    d_period: 3,
  }, close.length);
  console.log(stoch_result.stoch_k);
}

main();
