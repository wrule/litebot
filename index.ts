import { binance } from 'ccxt';
import { RealSpot } from './executor/real_spot';
const secret = require('./.secret.json');

async function main() {
  const exchange = new binance({ ...secret, enableRateLimit: true });
  console.log('加载市场...');
  await exchange.loadMarkets();
  const spot = new RealSpot({ exchange, symbol: 'BTC/USDT', init_funds: 0, init_assets: 0.00177 });
  console.log('发起交易...');
  await spot.SellAll();
  console.log('结束交易');
}

main();
