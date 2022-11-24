import { binance } from 'ccxt';

const secret = require('./.secret.json');

async function main() {
  const exchange = new binance(secret.exchange);
  const balance = await exchange.fetchFreeBalance();
  Object.entries(balance).forEach(([key, value]) => {
    if (value > 0) console.log(key, value);
  });
}

main();
