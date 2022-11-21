import { sma } from './tulind_wrapper';

async function main() {
  const close: number[] = [1, 2, 3, 4, 5];
  const data = sma(close, 4)
  console.log(data);
}

main();
