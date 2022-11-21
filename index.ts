import { stoch } from './tulind_wrapper';

async function main() {
  const close: number[] = [NaN, NaN, NaN];
  const data = stoch(close, close, close, {
    stoch_period: 2,
    k_period: 2,
    d_period: 2,
  });
  console.log(data);
}

main();
