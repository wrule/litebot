import { ExFactory } from './utils/ex_factory';

const secret = require('../.secret.json');

async function main() {
  const exchange = ExFactory(secret.exchange);
  await exchange.loadMarkets();
  console.log('你好，世界');
}

main();
