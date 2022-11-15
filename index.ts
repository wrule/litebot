import { binance } from 'ccxt';
import { RealSpot } from './executor/real_spot';
const secret = require('./.secret.json');

async function main() {
  const exchange = new binance({ ...secret, enableRateLimit: true });
  await exchange.loadMarkets();
  const spot = new RealSpot({ exchange, symbol: 'BTC/USDT', init_funds: 0, init_assets: 0.0007 });
  spot.SellAll();
}

main();
