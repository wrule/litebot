import { rsi } from './tulind_wrapper';

async function main() {
  const close: number[] = [1, 1, 3, 2, 2, 7, 8];
  const data = rsi(close, 4)
  console.log(data);
}

main();
