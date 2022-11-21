import { stoch, stoch_rsi, stoch_rsi_start } from './tulind_wrapper';

async function main() {
  const close: number[] = [];
  const data = stoch_rsi(close, {
    rsi_period: 2,
    stoch_period: 2,
    k_period: 2,
    d_period: 2,
  });
  console.log(data);
  console.log(stoch_rsi_start({
    rsi_period: 2,
    stoch_period: 2,
    k_period: 2,
    d_period: 2,
  }));
}

main();
