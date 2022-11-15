import { binance } from 'ccxt';
import { RealSpot } from './executor/real_spot';
const secret = require('./.secret.json');

async function main() {
  const exchange = new binance({ ...secret, enableRateLimit: true });
  console.log('加载市场...');
  await exchange.loadMarkets();
  const spot = new RealSpot({ exchange, symbol: 'SHIB/USDT', init_funds: 15, init_assets: 0 });
  console.log('发起交易...');
  console.log(await spot.BuyAll());
  console.log(await spot.SellAll());
  console.log(await spot.BuyAll());
  console.log(await spot.SellAll());
  console.log(await spot.BuyAll());
  console.log(await spot.SellAll());
  console.log('结束交易');
}

main();
