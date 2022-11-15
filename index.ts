import { binance } from 'ccxt';
import { RealSpot } from './executor/real_spot';
const secret = require('./.secret.json');

async function main() {
  const exchange = new binance({ ...secret, enableRateLimit: true });
  const spot = new RealSpot({ exchange, symbol: 'BTC/USDT', init_funds: 15 });
  spot.BuyAll();
}

main();
