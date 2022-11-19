import { rsi, stoch, stoch_rsi } from './tulind_wrapper';

let data = [2, 1, 2, 3, 4, 5, 6, 5, 4, 6, 6, 4, 4, 3, 4, 7, 7, 7, 7, 8];
const result = stoch_rsi(data, { rsi_period: 3, stoch_period: 3, k_period: 2, d_period: 2 });
console.log(result);
