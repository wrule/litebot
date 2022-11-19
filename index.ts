import { rsi, stoch } from './tulind_wrapper';

let data = rsi([2, 1, 2, 3, 4, 5, 6, 5, 4, 6, 6, 4, 4, 3, 4, 7, 7, 7, 7, 8], 3);
data = data.filter((item) => item);
const result = stoch(data, data, data, { stoch_period: 3, k_period: 2, d_period: 2 });
console.log(result);
