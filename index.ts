import { binance } from "ccxt";
import { RealSpot } from "./executor/real_spot";

const secret = require('./.secret.json');

async function main() {
  const exchange = new binance(secret.exchange);
  console.log('加载市场...');
  await exchange.loadMarkets();
  const spot = new RealSpot({
    exchange,
    symbol: 'ETH/BUSD',
    funds: 1e6,
  });
  console.log('交易');
  await spot.BuyAll(1200);
}

main();
